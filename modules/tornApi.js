class TornApi {
  ApiKey = {
    key: "",
    user: {
      id: 0,
      faction_id: 0,
      company_id: 0,
    },
    access: {
      level: 0,
      type: "",
      faction: false,
      company: false,
    },
  };
  storageKey = "torn_api_key";
  baseUrl = "https://api.torn.com/v2/";
  constructor(apikey) {
    this.setKey(apikey);
  }
  async setKey(newKey) {
    const keyInfo = await this.verifyKey(newKey);
    this.ApiKey.key = newKey;
    localStorage.setItem(this.storageKey, newKey);
  }
  async verifyKey(key) {
    const data = await this.PullData("key/info", key);
    if (!data || "error" in data) throw data;

    const access = data.info.access;

  }
  /**
   * @param {string} key
   * @param {string} selection
   * @param {Array<string>} parameters
   */
  async PullData(selection, key = null, parameters = null) {
    try {
      const param = parameters ? "?" + parameters.join("&") : "";
      const request = new Request(`${this.baseUrl}${selection}${param}`);
      request.headers.set("authorization", `ApiKey ${key ? key : this.ApiKey.key}`);
      request.headers.set("Content-type", "application/json");
      const data = await fetch(request)
        .then((response) => {if (response.ok) return response.json(); else throw response;})
        .catch((error) => {
          console.error("Error fetching data:", error);
          return null;
        });
      if (!data || "error" in data) throw data;
      return data;
    } catch (err) {
      console.error(`Error pulling Torn data: ${err.message}`);
      return null;
    }
  }
}

export { TornApi };
export default TornApi;

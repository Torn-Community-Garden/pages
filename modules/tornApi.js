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
  static storageKey = "torn_api_key";
  constructor(apikey) {
    this.setKey(apikey);
  }
  async setKey(newKey) {
    await this.verifyKey(newKey);
    this.ApiKey.key = newKey;
    localStorage.setItem(TornApi.storageKey, newKey);
  }
  async verifyKey(key) {
    const data = await this.PullData(key, "key/info");
  }
  /**
   * @param {string} key
   * @param {string} selection
   * @param {Array<string>} parameters
   */
  async PullData(key, selection, parameters = null) {
    try {
      const param = parameters ? "?" + parameters.join("&") : "";
      const reqInfo = {
        url: `https://api.torn.com/v2/${selection}${param}`,
        headers: {
          "Content-Type": "application/json",
          authorization: `ApiKey ${key}`,
        },
      };
      const data = await fetch(reqInfo)
        .then((response) => response.json())
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

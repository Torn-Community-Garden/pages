class TornApi {
  Api = {
    key: "",
    user: {
      id: 0,
      faction_id: 0,
    },
    access: {
      level: 0,
      type: "",
      faction: false,
    },
  };
  isLoggedIn = false;
  persist = false;
  storageKey = "tcg_key_cache";
  baseUrl = "https://api.torn.com/v2/";
  comment = "comment=TCGWebsite";
  ppm = 0;
  timer = 0;
  async initTimer() {
    try {
      if (this.timer > 0) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.ppm = 0;
      }, 60000);
    } catch (err) {
      console.error(`Error starting timer: ${err.message}`);
    }
  }
  async callOverLimit() {
    try {
      console.warn(
        "API call limit reached. Please wait before making more calls.",
      );
      setTimeout(() => {
        this.ppm = 0;
        console.info("You can now make API calls again.");
      }, 10000);
    } catch (err) {
      console.error(`Error handling API call limit: ${err.message}`);
    }
  }
  async authenticateUser(newKey, persist = false) {
    try {
      const keyInfo = this.verifyKey(newKey);
      if (keyInfo && !("error" in keyInfo)) {
        this.Api.user.id = keyInfo.user_id;
        this.Api.user.faction_id = keyInfo.faction_id;
        this.Api.access.level = keyInfo.access_level;
        this.Api.access.type = keyInfo.access_type;
        this.Api.access.faction = keyInfo.faction;
        this.persist = persist;
        this.Api.key = newKey;
        var successfulLogin = false;
        this.PullData("user/basic")
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `API request failed with status ${response.status}`,
              );
            }
            return response.json();
          })
          .then((data) => {
            if (!data || "error" in data) {
              document.querySelector("#authError").textContent =
                `API error: ${data.error ? data.error.error : "Unknown error"}`;
              return;
            } else {
              document.querySelector("#authUsername").textContent =
                `Logged in as: ${data.profile.name} [${data.profile.id}]`;
              successfulLogin = true;
            }
          });
        if (successfulLogin) {
          document
            .querySelector("#logInRoot")
            .classList.toggle("w3-hide", true);
          document
            .querySelector("#authRoot")
            .classList.toggle("w3-hide", false);
          if (persist) {
            localStorage.setItem(this.storageKey, newKey);
            sessionStorage.removeItem(this.storageKey);
          } else {
            localStorage.removeItem(this.storageKey);
            sessionStorage.setItem(this.storageKey, newKey);
          }
          this.isLoggedIn = true;
        }
      }
    } catch (err) {
      console.error(`Error authenticating user: ${err.message}`);
    }
  }
  async logoutUser() {
    try {
      this.Api = {
        key: "",
        user: {
          id: 0,
          faction_id: 0,
        },
        access: {
          level: 0,
          type: "",
          faction: false,
        },
      };
      this.isLoggedIn = false;
      this.persist = false;
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
      document.querySelector("#authRoot").classList.toggle("w3-hide", true);
      document.querySelector("#logInRoot").classList.toggle("w3-hide", false);
    } catch (err) {
      console.error(`Error logging out user: ${err.message}`);
    }
  }
  async verifyKey(key) {
    const response = this.PullData("key/info", key)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data || "error" in data) {
          document.querySelector("#authError").textContent =
            `API error: ${data.error ? data.error.error : "Unknown error"}`;
          throw new Error(
            `API error: ${data.error ? data.error.error : "Unknown error"}`,
          );
        }
        return data;
      });
    return response;
  }
  /**
   * @param {string} key
   * @param {string} selection
   * @param {Array<string>} parameters
   */
  async PullData(selection, key = null, parameters = null) {
    try {
      if (this.timer === 0) await this.initTimer();
      if (this.ppm >= 50 && this.timer > 0) {
        await this.callOverLimit();
        return;
      }
      const param = parameters
        ? `?${parameters.join("&")}&${this.comment}`
        : `?${this.comment}`;
      const request = new Request(`${this.baseUrl}${selection}${param}`);
      request.headers.set(
        "authorization",
        `ApiKey ${key ? key : this.Api.key}`,
      );
      request.headers.set("Content-type", "application/json");
      this.ppm += 1;
      return await fetch(request);
    } catch (err) {
      console.error(`Error pulling Torn data: ${err.message}`);
    }
  }
}

export { TornApi };
export default TornApi;

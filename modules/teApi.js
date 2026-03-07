class TeApi {
    base_url = "https://tornexchange.com"
    user_id = 0
    constructor(uid) {
        this.user_id = uid;
    }
    async PullPrice(itemId) {
        const response = await fetch(`${this.base_url}/api/price?user_id=${this.user_id}&item_id=${itemId}`)
            .catch((error) => {
                console.error("Error fetching data:", error);
                return null;
            });
        return response.json();
    }
}
export { TeApi };
export default TeApi;
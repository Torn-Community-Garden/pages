class TeApi {
    base_url = "https://tornexchange.com"
    user_id = 0
    constructor(uid) {
        this.user_id = uid;
    }
    async PullPrice(itemId) {
        try {
        const response = await fetch(
            `${this.base_url}/api/price?user_id=${this.user_id}&item_id=${itemId}`, 
            {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) return response;
        } catch (err) {
            console.error(`Error pulling TE price: ${err.message}`)
        }
    }
}
export { TeApi };
export default TeApi;
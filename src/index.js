const snekfetch = require('snekfetch');
const baseUrl = "https://discorddollars.com/api";

class Client {
      /**
      * Creates a new DiscordDollar Instance.
      * @param {string} token Your DiscordDollar token for this bot.
      */
    constructor(token) {
        if (!token) throw new Error("Please specify a token");
        this.token = token;
    }
      /**
      * Creates the request.
      * @param {string} method Http method to use.
      * @param {string} endpoint API endpoint to use.
      * @param {Object} [data] Data to send with the request.
      * @private
      * @returns {Promise<Object>}
      */
    request(method, endpoint, data) {
        const request = snekfetch[method](baseUrl + endpoint);
        if (method === 'post' && data) request.send(data);
        if (method === 'get' && data) request.query(data);
        request.set({
            Authorization: this.token
        });
        return request;
    }
      /**
      * Gets user's balance from his wallet.
      * @param {string} id The ID of the user you want to get the information from.
      * @returns {Promise<Object>}
      */
    async getBalance(id) {
        if (!id) throw new Error("Please specify a user ID");
        const response = await this.request('get', `/balance/${id}`);
        return response.body;    
    }
      /**
      * Gets user's balance from a bank.
      * @param {string} userID The ID of the user you want to get the information from.
      * @param {string} bankID The ID of the bank you want to get the information from.
      * @returns {Promise<Object>}
      */
    async getBalanceFromBank(userID, bankID) {
        if (!userID) throw new Error("Please specify a user ID");
        if (!bankID) throw new Error("Please specify a bank ID");
        const response = await this.request('get', `/balance/${id}`);
        return response.body;    
    }
      /**
      * Gets bank's information.
      * @param {string} id The ID of the bank you want to get the information from.
      * @returns {Promise<Object>}
      */
    async getBank(id) {
        if (!id) throw new Error("Please specify a bank ID");
        const response = await this.request('get', `/bank/${id}`);
        return response.body;    
    }
      /**
      * Made a transaction
      * @param {string} bfrom The ID of the current bank.
      * @param {string} bto The ID of the wanted bank.
      * @param {string} from tHE ID of the payer.
      * @param {string} to The ID of the payee.
      * @param {Number} amount The amount of money.
      * @returns {Promise<Object>}
      */
    async transact(bfrom, bto, from, to, amount) {
        if (!bfrom) throw new Error("Please specify the ID of the current bank");
        if (!bto) throw new Error("Please specify the ID of the wanted bank");
        if (!from) throw new Error("Please specify the ID of the payer");
        if (!to) throw new Error("Please specify the ID of the payee");
        if (!amount) throw new Error("Please specify the amount of money");
        if (amount == 0) throw new Error("Please specify a larger amount than 0");
        if (isNaN(amount) || amount.includes(".") || amount.includes("+") || amount.includes("-") || Number(amount) < 0 || amount <= 0) throw new Error("Please specify a valid amount of money");
        const fromRes = await this.request('get', `/api/bank/${bfrom}/balance/${from}`);
        const toRes = await this.request('get', `/api/bank/${bto}/balance/${to}`);
        const bfromRes = await this.request('get', `/bank/${bfrom}`);
        const btoRes = await this.request('get', `/bank/${bto}`);
        if (!fromRes.body.id) throw new Error("The payer ID cannot be found in the database");
        if (!toRes.body,id) throw new Error("The payee ID cannot be found in the database");
        if (!bfromRes.body.id) throw new Error("The 1st bank ID cannot be found in the database");
        if (!btoRes.body.id) throw new Error("The 2st bank ID cannot be found in the database");
        if (amount > fromRes.body.balance) throw new Error("The payer doesn't have enough money");
        const data = {};
        data.bfrom = bfrom;
        data.bto = bto;
        data.from = from;
        data.to = to;
        data.amount = amount;
        const response = await this.request('post', `/transact`, data);
        return response.body;
    }
}

module.exports = Client;

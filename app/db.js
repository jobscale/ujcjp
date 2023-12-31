const { Deta } = require('deta');
const { planNine } = require('./js-proxy');

const { PARTNER_HOST } = process.env;

class DB {
  async allowInsecure(use) {
    if (use === false) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    else process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  fetchEnv() {
    if (!this.cache) this.cache = {};
    if (this.cache.env) return Promise.resolve(this.cache.env);
    const params = {
      host: 'https://partner.credentials.svc.cluster.local',
    };
    if (PARTNER_HOST) params.host = PARTNER_HOST;
    const Cookie = 'X-AUTH=X0X0X0X0X0X0X0X';
    const url = `${params.host}/db.env.json`;
    const options = { headers: { Cookie } };
    return this.allowInsecure()
    .then(() => fetch(url, options))
    .then(res => this.allowInsecure(false) && res.json())
    .then(res => {
      this.cache.env = res.body;
      return this.cache.env;
    });
  }

  async getKey() {
    const { DETA_PROJECT_KEY } = process.env;
    if (DETA_PROJECT_KEY) return DETA_PROJECT_KEY;
    if (planNine) return JSON.parse(planNine()).DETA_PROJECT_KEY;
    return this.fetchEnv()
    .then(env => env.DETA_PROJECT_KEY);
  }

  async connection(tableName) {
    if (!this.cache) this.cache = {};
    if (this.cache[tableName]) return this.cache[tableName];
    const detaKey = await this.getKey();
    const deta = Deta(detaKey);
    this.cache[tableName] = deta.Base(tableName);
    return this.cache[tableName];
  }
}

const db = new DB();

module.exports = {
  connection: tableName => db.connection(tableName),
};

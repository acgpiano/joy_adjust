const got = require("got");

class Adjust {
  /**
   *
   * @param {object} options adjust配置
   * @param {string} options.event_token 秘钥
   * @param {string} options.app_token 秘钥
   * @param {string} is_turn_on 开关
   */
  constructor(options, is_turn_on = true) {
    const params = ["event_token", "app_token"];
    this.is_turn_on = is_turn_on;
    for (let key of params) {
      if (!options[key]) {
        console.error(`Adjust初始化缺少必要参数：${key}`);
        this.is_turn_on = false;
      }
    }
    options.s2s = 1;
    this.options = options;
  }

  /**
   *
   * @param {object} options 统计选项
   * @param {string} options.idfa 统计选项
   * @param {string} options.gps_adid 统计选项
   * @param {string} options.adid 统计选项
   * @param {number} options.revenue 统计选项
   * @param {boolean} sandbox 是否沙盒环境
   * @returns
   */
  async sendRevenue(options, sandbox) {
    // 初始化失败
    if (!this.is_turn_on) {
      return null;
    }
    // 测试订单
    if (sandbox) {
      options.environment = "sandbox";
    } else {
      options.environment = "production";
    }
    // 判断参数
    if (!options.idfa && !options.gps_adid && !options.adid) {
      return null;
    }
    options.created_at_unix = Date.now();
    options.currency = "USD";

    try {
      let { body } = await got({
        url: "https://s2s.adjust.com/event",
        method: "POST",
        form: Object.assign(this.options, options),
        timeout: 3000
      });
      return body;
    } catch (e) {
      console.error(`Adjust统计发送失败：${e}`);
      return null;
    }
  }
}

module.exports = Adjust;

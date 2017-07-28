dnspy: 显示客户端的 DNS 服务器地址
---

洗澡胡思乱想时的脑洞。演示：[http://141.193.21.67:8080](http://141.193.21.67:8080)。

### 部署

需要的东西：

- 一个域名，例子中使用 `dnspy.nat.moe`。
- 一台服务器。

1. 将 `dnspy.nat.moe` 的 A 记录指向服务器。
2. 将 `test.dnspy.nat.moe` 的 NS 记录指向服务器。
3. 修改 `config.json` 内的 `testhost` 值为 (2) 中的域名 (`test.dnspy.nat.moe`)。
4. `$ node index.js`
5. 访问服务器的 8080 端口。

### License

Public Domain.

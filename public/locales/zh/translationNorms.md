# 翻译规范

## 📌 常用术语规范

本节主要包含一些容易出现同义译文的原文，目的是尽量规范地使用一种译文，或者在不同场景下区分使用不同的译文，最大程度上提供一致的语言环境，提升用户体验。

- "name": "名称". 一般统一译为 "名称" 而非 "名字"、"域名"。
- "subname": "子名称". 不同于 "subdomain"，这里的 "subname" 译为 "子名称" 更合适。
- "parent", "parent name": "父名称"
- "primary name": "主名称"
- "primary ENS name": "ENS 主名称"
- "profile": "个人资料"
- "you": "您"
- "your": "您的"
- "registrant": "注册人"
- "controller": "管理员"
- "owner": "所有者"
- "manager": "管理员"
- "editor": "编辑员"
- "extend": "续期"
- "expiry": "有效期", "到期", "到期时间". 与权限期限有关的情况下，译为 "有效期"，其他情况下，译为 "到期" 或 "到期时间"。
- "expires": "到期", "到期时间"
- "expired": "已过期"
- "clamin": "认领"
- "change": "更改"
- "add": "添加"
- "set": "设置"
- "next": "下一步"
- "back": "上一步", "返回".
- "search": "搜索"
- "confirm": "确认". 通常译作 "确认"，而没有使用 "确定"。
- "remove": "移除"
- "delete": "删除"
- "clear": "清除"
- "selected": "选中项"
- "gas": "网络费". Metamask 中的译文为 "燃料"。
- "sign": "签名"
- "transfer": "转移". 一般用于名称所有权的变化，译作 "转移" 而不是 "转让" 主要是参考了 OpenSea 等主流应用在同等场景下的译文。
- "send": "发送". 一般译作 "发送"；在用于权限所属的变化时，也可译作 "转让"。
- "revoke": "撤销"
- "burn": "烧毁"
- "wrap": "包装"
- "unwrap": "解除包装"
- "NameWrapper": "名称包装器". 这里特指名称包装器这一智能合约。
- "emancipated": "已解放"
- "locked: "已锁定"
- "grant": "授权"
- "fuses": "保险丝"
- "custom": "自定义"
- "filter": "筛选"
- "enable": "启用", "激活". 单纯表示开启动作时，译为 "启用"；由其他事件触发时，译为 "激活"。

## 🔍 针对译文的测试步骤

1. 将译文仔细阅读一遍。检查是否有错字、错词、漏译、语病、标点等问题，是否有需要优化的句子和段落。
2. 版本保存，git commit。
3. 在本地运行测试，pnpm dev。检查是否会产生运行错误，是否存在译文的显示问题。
4. 版本上传，git push。
5. 合并代码，上线测试。

## 🌏 关于国际化的一些建议

### 同步更新其他语言的文件

建议在修改 /en 文件夹中的内容时，要将变化的内容同步到其他语言的文件夹内，便于译者及时更新译文。

### 考虑不同语言间的语序问题

由于表达习惯的差异，不同语种的句子中的词语顺序有很多差别，建议尽量避免将一个句子的某个词作为变量引入。

比如，MyNames.tsx 文件中的 134 行：

```ts
subtitle={`${t('subtitle.start')} ${isSelf ? t('subtitle.your') : t('subtitle.this')} ${t(
        'subtitle.wallet',
      )}`}
```

建议换成如下形式：

```ts
subtitle={
  `${isSelf ? t('subtitle.start-your-wallet') : t('subtitle.start-this-wallet')}`
  }
```

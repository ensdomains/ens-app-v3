# 翻译规范

## 📌 常用术语规范

本节主要包含一些容易出现同义译文的原文，目的是尽量规范地使用一种译文，或者在不同场景下区分使用不同的译文，最大程度上提供一致的语言环境，提升用户体验。

- "name": "名字". 一般统一译为 "名字" 而非 "名称"、"域名"。
- "subname": "子名". 不同于 "subdomain"，这里的 "subname" 译为 "子名" 更合适。
- "you": "您"
- "your": "您的"
- "registrant": "注册人"
- "controller": "管理员"
- "owner": "所有者"
- "manager": "管理者"
- "extend": "续期"
- "expiry": "有效期", "到期". 与权限期限有关的情况下，译为 "有效期"，其他情况下，译为 "到期"。
- "expires": "到期"
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
- "selected": "选中项"
- "gas": "网络费". Metamask 中的译文 "燃料" 过于机械了。
- "sign": "签名"
- "transfer": "转移". 一般用于名字所有权的变化，译作 "转移" 而不是 "转让" 主要是参考了 OpenSea 等主流应用在同等场景下的译文。
- "send": "发送". 一般译作 "发送"；在用于权限所属的变化时，也可译作 "转让"。
- "parent": "父级"
- "wrap": "包装"
- "unwrap": "解除包装"
- "NameWrapper": "名字包装器". 这里特指名字包装器这个智能合约。
- "grant": "授权"
- "fuses": "保险丝"
- "custom": "自定义"

- "filter": "筛选"
- "enable": "启用", "激活". 单纯表示开启动作时，译为 "启用"；由其他事件触发时，译为 "激活"。

- "field": "标识" / "字段" ?

- 在涉及权限的部分，是否需要给权限加上“可以”等词，用于匹配原文中的 Can? 建议不使用。
- 类似的情况还有：这个、这项，等等，是去掉还是改成诸如 “此”、“该” 等单字?

## 🔍 需要复核的译文

- common.json
  - transaction.info.updateEthAddress: "Update ETH address to this address"
  - transaction.info.fuses.grant: "Grant"
  - transaction.status.notOwned: "Not Owned"
  - transaction.status.owned: "Owned"
- profile.json
  - tabs.permissions.nameChangePermissions.title: "Name Change Permissions"
  - details.sendName.makeOwner: "Make owner"
  - details.sendName.makeManager: "Make manager"

## 🌏 关于国际化的一些建议

### 同步更新其他语言的文件

一是要信息的数量一定保持一致
二是要保证文本是最新的，如果英文修改了，还没有翻译，先用英文占位。
方便译者及时更新

### 注册语序问题

## 🤔 翻译过程中的一些疑惑

### 关于 “保险丝” 这个词

我发现在最新版本的 APP 中，已经很少在用户界面出现 “保险丝” 这个词，是有意避免用户接受难懂的概念吗？如果是这样，以后是不是在用户界面上彻底删除这个词？因为现在还有一些地方存在这个词。

### 不同语言间的语序问题

MyNames.tsx 文件中的 134 行：

```ts
subtitle={`${t('subtitle.start')} ${isSelf ? t('subtitle.your') : t('subtitle.this')} ${t(
        'subtitle.wallet',
      )}`}
```

### 一些使用问题

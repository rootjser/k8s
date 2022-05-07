#装插件
GitLab
Generic Webhook Trigger	
Parameterized Trigger
Git Parameter


#Gialab配置webhook
1、允许网络
http://192.168.1.200:30300/admin/application_settings/network
Outbound requests 标签 把Allow勾选上 -> 保存


# Jenkins中配置参数
2、Jenkins构建触发器Generic Webhook Trigger
Post content parameters添加变量
Variable                      Expression
MR_TO_BRANCH                  $.object_attributes.target_branch             JSONPath
MR_STATE                      $.object_attributes.state                     JSONPath

Optional filter
Expression                     Text
^main,merged$                  $MR_TO_BRANCH,$MR_STATE

Token填随机唯一串 如 webtesttoken

# 添加MergeRequest的webhook
3、http://192.168.1.200:30300/root/webtest/-/hooks
URl字段填写http://192.168.1.200:30400/generic-webhook-trigger/invoke?token=webtesttoken
Trigger只勾选Merge request events
保存
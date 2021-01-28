https://spring.io/guides/tutorials/react-and-spring-data-rest/:wq:

### node.js setting
you can choose one of followings:
1. run below:
```shell
$ gradlew installNode
```
2. setting node's directory in `build.gradle` - `nodeInstallDirectory`
```
frontend {
    nodeDistributionProvided = true
    nodeInstallDirectory = file("${projectDir}/node")
}
```

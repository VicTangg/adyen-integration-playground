# adyen-integration-playground


config.vm.network :forwarded_port, guest:8080, host: 8080
config.vm.network :forwarded_port, guest:5000, host: 5000
config.vm.network :forwarded_port, guest:1337, host: 1337 # e2e tests (testcafe)
config.vm.network :forwarded_port, guest:1338, host: 1338 # e2e tests (testcafe)
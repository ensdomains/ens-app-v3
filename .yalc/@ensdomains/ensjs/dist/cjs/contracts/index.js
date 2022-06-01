'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
class ContractManager {
  provider
  constructor(provider) {
    this.provider = provider
  }
  generateContractGetter = (path) => {
    let imported
    let contract
    return async (passedProvider, address) => {
      if (!imported) {
        imported = (
          await Promise.resolve().then(() =>
            __importStar(
              require(/* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
              `./${path}`),
            ),
          )
        ).default
      }
      if (passedProvider) {
        return imported(passedProvider, address)
      }
      if (!contract) {
        contract = imported(this.provider)
      }
      return contract
    }
  }
  getPublicResolver = this.generateContractGetter('publicResolver')
  getUniversalResolver = this.generateContractGetter('universalResolver')
  getRegistry = this.generateContractGetter('registry')
  getReverseRegistrar = this.generateContractGetter('reverseRegistrar')
  getDNCOCURP = this.generateContractGetter(
    'doNotCallOnChainUniversalResolverProxy',
  )
  getNameWrapper = this.generateContractGetter('nameWrapper')
  getBaseRegistrar = this.generateContractGetter('baseRegistrar')
  getMulticall = this.generateContractGetter('multicall')
}
exports.default = ContractManager

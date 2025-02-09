import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { HookRegistered } from "../generated/schema"
import { HookRegistered as HookRegisteredEvent } from "../generated/Events/Events"
import { handleHookRegistered } from "../src/events"
import { createHookRegisteredEvent } from "./events-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let merchant = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let hook = Address.fromString("0x0000000000000000000000000000000000000001")
    let newHookRegisteredEvent = createHookRegisteredEvent(merchant, hook)
    handleHookRegistered(newHookRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("HookRegistered created and stored", () => {
    assert.entityCount("HookRegistered", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "HookRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "merchant",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "HookRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hook",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

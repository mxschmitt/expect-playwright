import { assertSnapshot } from "../tests/utils"

describe("toBeDisabled", () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext()
  })

  describe("selector", () => {
    it("positive", async () => {
      await page.setContent('<button id="foo" disabled>')
      await expect(page).toBeDisabled("#foo")
    })

    it("negative: target element isn't enabled", async () => {
      await page.setContent('<button id="foo">')
      await assertSnapshot(() => expect(page).toBeDisabled("#foo"))
    })

    it("negative: target element not found", async () => {
      await page.setContent('<button id="foo">')
      await assertSnapshot(() =>
        expect(page).toBeDisabled("#bar", { timeout: 1000 })
      )
    })
  })

  describe("element", () => {
    it("positive", async () => {
      await page.setContent('<button id="foo" disabled>')
      const button = page.$("#foo")
      await expect(button).toBeDisabled()
      await expect(await button).toBeDisabled()
    })

    it("negative: target element isn't enabled", async () => {
      await page.setContent('<button id="foo">')
      const button = await page.$("#foo")
      await assertSnapshot(() => expect(button).toBeDisabled())
    })
  })

  describe("with 'not' usage", () => {
    it("positive", async () => {
      await page.setContent('<button id="foo">')
      await expect(page).not.toBeDisabled("#foo")
    })

    it("negative", async () => {
      await page.setContent('<button id="foo" disabled>')
      await assertSnapshot(() => expect(page).not.toBeDisabled("#foo"))
    })
  })

  describe("timeout", () => {
    it("positive: should be able to use a custom timeout", async () => {
      setTimeout(() => page.setContent('<button id="foo" disabled>'), 500)
      await expect(page).toBeDisabled("#foo", { timeout: 1000 })
    })

    it("should throw an error after the timeout exceeds", async () => {
      const start = new Date().getTime()
      await assertSnapshot(() =>
        expect(page).toBeDisabled("#foo", { timeout: 1000 })
      )
      const duration = new Date().getTime() - start
      expect(duration).toBeGreaterThan(1000)
      expect(duration).toBeLessThan(1500)
    })
  })
})

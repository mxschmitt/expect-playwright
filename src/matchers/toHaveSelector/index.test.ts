import { assertSnapshot } from "../tests/utils"

describe("toHaveSelector", () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext()
  })
  it("positive", async () => {
    await page.setContent(`<div id="foobar">Bar</div>`)
    await expect(page).toHaveSelector("#foobar")
  })
  it("positive with an element handle", async () => {
    await page.setContent(`<div id="foo"><div id="bar">Baz</div></div>`)
    const handle = await page.$("#foo")
    expect(handle).toBeTruthy()
    await expect(handle).toHaveSelector("#bar")
  })
  it("positive in frame", async () => {
    await page.setContent(`<iframe src="http://localhost:8080"></iframe>`)
    const handle = page.$("iframe")
    await expect(handle).toHaveSelector("#attr")
    await expect(await handle).toHaveSelector("#attr")

    const frame = (await handle)?.contentFrame()
    await expect(frame).toHaveSelector("#attr")
    await expect(await frame).toHaveSelector("#attr")
  })
  it("negative", async () => {
    await assertSnapshot(() =>
      expect(page).toHaveSelector("#foobar", { timeout: 1000 })
    )
  })

  describe("with 'not' usage", () => {
    it("positive", async () => {
      await expect(page).not.toHaveSelector("#foobar")
    })

    it("negative", async () => {
      await page.setContent(`<div id="foobar">Bar</div>`)
      await assertSnapshot(() =>
        expect(page).not.toHaveSelector("#foobar", { timeout: 1000 })
      )
    })
  })

  describe("timeout", () => {
    it("positive: should be able to use a custom timeout", async () => {
      setTimeout(async () => {
        await page.setContent(`<div id="foobar">Bar</div>`)
      }, 500)
      await expect(page).toHaveSelector("#foobar", { timeout: 1000 })
    })
    it("should throw an error after the timeout exceeds", async () => {
      const start = new Date().getTime()
      await assertSnapshot(() =>
        expect(page).toHaveSelector("#foobar", { timeout: 1000 })
      )
      const duration = new Date().getTime() - start
      expect(duration).toBeLessThan(1500)
    })
  })
})

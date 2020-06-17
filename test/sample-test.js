const { assert } = require("chai");

describe("UBI", function() {
  let ubi;
  beforeEach(async () => {
    const UBI = await ethers.getContractFactory("UBI");
    ubi = await UBI.deploy({ value: ethers.utils.parseEther("10.0") });
    await ubi.deployed();
  });

  it('should have a balance', async () => {
    const balance = await ethers.provider.getBalance(ubi.address);
    assert.equal(ethers.utils.formatEther(balance).toString(), "10.0");
  });

  describe('withdrawing as the attacker', () => {
    let attacker;
    beforeEach(async () => {
      const Attacker = await ethers.getContractFactory("Attacker");
      attacker = await Attacker.deploy(ubi.address);
      await attacker.deployed();
      await attacker.withdraw();
    });

    it('should have 1 ether', async () => {
      const balance = await ethers.provider.getBalance(attacker.address);
      assert.equal(ethers.utils.formatEther(balance).toString(), "1.0");
    });
  });

  describe('withdrawing once', () => {
    beforeEach(async () => {
      await ubi.withdraw();
    });

    it('should have withdrawn 1 ether', async () => {
      const balance = await ethers.provider.getBalance(ubi.address);
      assert.equal(ethers.utils.formatEther(balance).toString(), "9.0");
    });

    describe('withdraw a second time after a day', () => {
      beforeEach(async () => {
        const day = (24 * 60 * 60) + 1;
        await ethers.provider.send('evm_increaseTime', [day])
        await ubi.withdraw();
      });

      it('should withdraw from the ubi', async () => {
        const balance = await ethers.provider.getBalance(ubi.address);
        assert.equal(ethers.utils.formatEther(balance).toString(), "8.0");
      });
    });

    describe('withdraw a second time', () => {
      beforeEach(async () => {
        try {
          await ubi.withdraw();
        }
        catch(ex) {

        }
      });

      it('should not have withdrawn anything more', async () => {
        const balance = await ethers.provider.getBalance(ubi.address);
        assert.equal(ethers.utils.formatEther(balance).toString(), "9.0");
      });
    });
  });
});

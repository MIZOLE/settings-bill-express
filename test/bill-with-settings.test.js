const assert = require("assert")
const SettingsBill = require('../bill-with-settings')

describe("bill with settings", function () {

    it("should be able to record the calls", function () {
        const settings = SettingsBill();
        settings.recordAction("call")
        assert.equal(1, settings.actionsFor("call").length)
    })

    it("should be able to set the settings", function () {
        const SettingBill = SettingsBill()

        SettingBill.setSettings({
            callCost: 3.35,
            smsCost: 2.35,
            warningLevel: 10,
            criticalLevel: 15
        });

        console.log({values: SettingBill.getSetting()});
        

        assert.deepEqual({
            callCost: 3.35,
            smsCost: 2.35,
            warningLevel: 10,
            criticalLevel: 15
        }, SettingBill.getSetting())

    });

    it("should calculate the good totals", function () {
        const Settings = SettingsBill()
        Settings.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        Settings.recordAction('call')
        Settings.recordAction('call')
        Settings.recordAction('sms')
        Settings.recordAction('sms')

        assert.equal(4.70, Settings.totals().smsTotal);
        assert.equal(6.70, Settings.totals().callTotal);
        assert.equal(11.40, Settings.totals().grandTotal);

    });

    it("should be able to calculate the good totals for multiple actions", function () {
        const settingsbill = SettingsBill();
        settingsbill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsbill.recordAction('call')
        settingsbill.recordAction('call')
        settingsbill.recordAction('sms')
        settingsbill.recordAction('sms')

        assert.equal(4.70, settingsbill.totals().smsTotal);
        assert.equal(6.70, settingsbill.totals().callTotal);
        assert.equal(11.40, settingsbill.totals().grandTotal);
    });

    it("should be able to get the warning level", function () {

        const settingsbill = SettingsBill()

        settingsbill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 20,
            criticalLevel: 30
        });

        settingsbill.recordAction('call')
        settingsbill.recordAction('sms')
        settingsbill.recordAction('call')
        settingsbill.recordAction('call')
        settingsbill.recordAction('sms')

        assert.strictEqual('warning', settingsbill.totalClassName())
    });

    it("should be able to get critical level", function () {
        const settings = SettingsBill();

        settings.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10

        });

        settings.recordAction('call')
        settings.recordAction('call')
        
        assert.equal("danger", settings.totalClassName())
    });

});
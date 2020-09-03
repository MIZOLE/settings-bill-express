module.exports = function BillWithSettings() {
    let callCost;
    let smsCost;
    let warningLevel;
    let criticalLevel;

    var actionsList = [];


    function setSettings(settings) {
        callCost = Number(settings.callCost)
        smsCost = Number(settings.smsCost)
        warningLevel = Number(settings.warningLevel)
        criticalLevel = Number(settings.criticalLevel)

    }

    function getSetting() {
        return {
            callCost,
            smsCost,
            warningLevel,
            criticalLevel

        }
    }


    function recordAction(action) {

        if (action) {
            if (!hasReachedTheCriticalLevel()) {
                let cost = 0;
                if (action === "sms") {
                    cost = smsCost
                } else if (action === "call") {
                    cost = callCost
                }

                actionsList.push({
                    type: action,
                    cost,
                    timestamp: new Date()
                });
            }
        }
    }


    function actions() {

        return actionsList;
    }

    function actionsFor(type) {

        return actionsList.filter((action) => action.type === type)

    }

    function getTotal(type) {

        return actionsList.reduce((total, action) => {
            let val = action.type === type ? action.cost : 0;
            return total + val;
        }, 0);

    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)

        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal().toFixed(2)
        }

    };

    function hasReachedTheWarningLevel() {
        const total = grandTotal();
        return total >= warningLevel
            && total < criticalLevel;
    }

    function hasReachedTheCriticalLevel() {
        const total = grandTotal();
        return total >= criticalLevel;
    }



    function totalClassName() {
        const total = grandTotal()

        if (total >= criticalLevel) {
            return "danger";
        }

        else if (total >= warningLevel && total < criticalLevel) {
            return "warning";
        }

    }

    return {
        setSettings,
        getSetting,
        recordAction,
        actions,
        actionsFor,
        totals,
        totalClassName,
        hasReachedTheWarningLevel,
        hasReachedTheCriticalLevel
    }

}























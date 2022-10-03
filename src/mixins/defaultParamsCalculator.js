export const defaultParamsCalculator = {
    data () {
        return {
            defaultPriceCar: 3300000,
            defaultTermLease: 60,
            defaultInitialPercent: 13,
            percentRate: 3.5,
            minPriceCar: 1000000,
            maxPriceCar: 6000000,
            minInitialPercent: 10,
            maxInitialPercent: 60,
            minTermLease: 1,
            maxTermLease: 60,
       }
    },
    methods: {
        checkPriceCarValue (value) {
            if (value < this.minPriceCar) {
                return  this.minPriceCar;
            } else if (value > this.maxPriceCar) {
                return this.maxPriceCar;
            }  else {
                return value
            }
        },
        checkTermLeaseValue (value) {
            if (value < this.minTermLease) {
                return this.minTermLease;
            } else if (value > this.maxTermLease) {
                return this.maxTermLease;
            } else {
                return value
            }
        },
        checkInitialPaymentValue (value) {
            if (this.minInitialPercent > value) {
                return this.minInitialPercent;
            } else if (value > this.maxInitialPercent) {
                return this.maxInitialPercent;
            } else {
                return value
            }
        }

    }

}

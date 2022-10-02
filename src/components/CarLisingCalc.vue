<template>
    <div class="calculator">
        <h1 class="calculator__title">Рассчитайте стоимость автомобиля в лизинг</h1>
        <div class="calculator__fields-elements">
            <div :class="[ disabled ? 'calculator__element_type_field disabled' : '', 'calculator__element calculator__element_type_field']">
                <label 
                    for="costCar" 
                    class="calculator__label"> 
                    Стоимость автомобиля 
                </label>
                <div class="calculator__input-block">
                    <input 
                        v-model="costCar" 
                        autocomplete="off" 
                        id="costCar" 
                        type="number" 
                        placeholder="Введите стоимость машины" 
                        class="calculator__input"
                        :disabled="disabled"
                        @focus="setActiveClass"
                        @blur="deleteActiveClass"
                        @change="validCostCar"
                
                    /> ₽
                    <input 
                        v-model="costCar" 
                        type="range" 
                        min="1000000" 
                        max="6000000"
                        :disabled="disabled"
                        class="e-range"
                    />
              
                </div>
            </div>
            <div :class="[ disabled ? 'calculator__element_type_field disabled' : '', 'calculator__element calculator__element_type_field']">
                <label 
                    for="initialPayment" 
                    class="calculator__label"> 
                    Первоначальный взнос 
                </label>
                <div class="calculator__input-block calculator__input-block_type_payment">
                    <input
                        v-model="initialPayment"
                        id="initialPayment"
                        type="number"
                        class="calculator__input"
                        placeholder="Введите процент взноса"
                        autocomplete="off"
                        :disabled="disabled"
                        @focus="setActiveClass"
                        @blur="deleteActiveClass"
                        @input="clearInitialPayment"
                        @change.prevent="changeInitialPayment"            
                    />
                    <input 
                        v-model="initialPercent"
                        type="range"
                        min="10"
                        max="60"
                        class="e-range"
                        :disabled="disabled"
                        @input="changeInitialPayment"
                    />
                    <div class="calculator__init-block">
                        {{ initialPercent }}%
                    </div>
                </div>
            </div>
            <div :class="[ disabled ? 'calculator__element_type_field disabled' : '', 'calculator__element calculator__element_type_field']">
                <label 
                    for="termLease" 
                    class="calculator__label"> 
                    Срок лизинга 
                </label>
                <div class="calculator__input-block">
                    <input 
                        v-model="termLease" 
                        id="termLease" 
                        type="number" 
                        class="calculator__input" 
                        placeholder="Введите срок лизинга" 
                        autocomplete="off"
                        :disabled="disabled"
                        @focus="setActiveClass"
                        @blur="deleteActiveClass"
                        @change="validTermLease"
                    /> мес.
                    <input 
                        v-model="termLease"
                        type="range"
                        min="1"
                        max="60"
                        :disabled="disabled"
                        class="e-range"
                    />
                </div>
            </div>
            <div class="calculator__element">
                <h5 class="calculator__label"> Сумма договора лизинга </h5>
                <div class="calculator__values">{{sumLeasing.toLocaleString()}} ₽</div>
               
            </div>
            <div class="calculator__element">
                <h5 class="calculator__label">  Ежемесячный платеж от </h5>
                <div class="calculator__values">{{monthPay.toLocaleString()}} ₽</div>
            </div>
            <div class="calculator__element">
                <button 
                    :class="[ (disabled || disabledButton) ? 'calculator__button disabled' : '', 'calculator__button ']"
                    :disabled="disabled || disabledButton"
                    @click.prevent="sendCalcData"
                >
                <span v-if="!loading">
                    Оставить заявку
                </span>
                <div v-else class="spinner">

                </div>
                
                </button>
            </div>
        </div>
        <div 
        v-if="successMessage" 
        class="calculator__success">
            <p class="calculator__success-message">
                {{ successMessage }}  
            </p>
            <a 
                class="calculator__link"
                href="#"
                @click.prevent="updateForm"
                >
                Рассчитать стоимость для другого автомобиля
            </a>
        </div>
    
    </div>
</template>

<script>

import { sendCalcData } from '../fetch'

export default {
    name: 'CarLisingCalc',
    data() {
        return {
            defaultCostCar: 3300000,
            defaultTermLease: 60,
            defaultInitialPercent: 13,
            percentRate: 3.5,
            costCar: 0,
            termLease: 0,
            initialPercent: 0,
            initialPayment: 0,
            errorMessage: '',
            successMessage: '',
            loading: false,
            disabled: false,
            focusedInput: false
        }
    },
    computed: {
        disabledButton () {
            return this.sumLeasing == 0 || this.monthPay == 0
        },
        sumLeasing () {
            if (this.initialPayment >= 1000) {
                let sum = this.initialPayment + this.termLease * this.monthPay
                let result = this.monthPay === 0 ? 0 : sum
                return result
            } else {
                return 0
            }
        },
        monthPay () {
            let pay = (this.costCar - this.initialPayment) * ((this.percentRate/100 * Math.pow((1 + this.percentRate/100), this.termLease)) / (Math.pow((1 + this.percentRate/100), this.termLease) - 1))
            let roundPay = Math.round(pay)
            let result = (roundPay === Infinity || this.initialPercent < 1) ? 0 : roundPay
            return result
        }

    },
    watch: {
        costCar (value) {
            if (value) {
                this.initialPayment = Math.round(value * this.initialPercent / 100)
            } 
          
        }
    },
    created() {
        this.setDefaultParams()
    },
    methods: {
        validCostCar(e) {
            if (e.target.value < 1000000) {
                this.costCar = 1000000  
            } else if (e.target.value > 6000000) {
                this.costCar = 6000000  
            }
        },
        validTermLease(e) {
            if (e.target.value < 1) {
                this.termLease = 1 
            } else if (e.target.value > 60) {
                this.termLease = 60
            }
        },
        setDefaultParams() {
            this.costCar = this.defaultCostCar
            this.termLease =  this.defaultTermLease
            this.initialPercent = this.defaultInitialPercent
            this.initialPayment = Math.round(this.costCar * this.initialPercent / 100)

        },

        changeInitialPayment(event) {
            if (10 > event.target.value) {
                this.initialPercent = 10
            } else if (event.target.value > 60) {
                this.initialPercent = 60
            } else {
                this.initialPercent = event.target.value
            } 
            this.initialPayment = Math.round(this.costCar * this.initialPercent / 100)
        },
        clearInitialPayment(event) {
            if  (event.target.value > 60) {
                this.initialPayment = ''
            }
        },

        setActiveClass(e) {
            e.target.closest('.calculator__input-block').classList.add('active')
        },

        deleteActiveClass (e) {
            e.target.closest('.calculator__input-block').classList.remove('active')
        },

        async sendCalcData () {
            let data = {
                costCar: this.costCar,
                termLease: this.termLease,
                initialPayment: this.initialPayment,
                sumLeasing: this.sumLeasing,
                monthPay: this.monthPay
            }
            this.loading = true
            this.disabled = true

            try {
                const response = await sendCalcData(data)
        
                if (response.status === 200) {
                    this.successMessage = 'Ваши данные успешно отправлены  '         
                }
                else {
                    this.errorMessage = response.text()
                }
            }
            catch (e) {
                this.errorMessage = 'Что-то пошло не так, попробуйте позже'
            }
            finally {
                this.loading = false
            }

    
        },
        updateForm() {
            this.disabled = false
            this.setDefaultParams()
            this.successMessage = ''
        }
 
    }
}
</script>

<style>

</style>
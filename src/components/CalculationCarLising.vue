<template>
  <div class="calculator">
    <h1 class="calculator__title">Рассчитайте стоимость автомобиля в лизинг</h1>
    <div class="calculator__fields-elements">
      <div
        :class="[
          disabled ? 'calculator__element_type_field disabled' : '',
          'calculator__element calculator__element_type_field',
        ]"
      >
        <label for="priceCar" class="calculator__label">
          Стоимость автомобиля
        </label>
        <div class="calculator__input-block" @click="onFocusInput">
          <input
            v-model="priceCarInput"
            class="calculator__input"
            id="priceCar"
            type="text"
            placeholder="Введите стоимость машины"
            autocomplete="off"
            :disabled="disabled"
            @keyup.enter="onBlurInput"
            @focus="setActiveClass"
            @blur="deleteActiveClass"
            @input="formatPriceCarInput"
            @change="changePriceCar"
          />
          ₽
          <input
            v-model="priceCar"
            type="range"
            :min="minPriceCar"
            :max="maxPriceCar"
            :disabled="disabled"
            class="e-range"
          />
        </div>
      </div>
      <div
        :class="[
          disabled ? 'calculator__element_type_field disabled' : '',
          'calculator__element calculator__element_type_field',
        ]"
      >
        <label for="initialPay" class="calculator__label">
          Первоначальный взнос
        </label>
        <div
          class="calculator__input-block calculator__input-block_type_payment"
          @click="onFocusInput"
        >
          <input
            v-model="initialPayInput"
            class="calculator__input"
            id="initialPay"
            type="text"
            placeholder="Введите процент взноса"
            autocomplete="off"
            :disabled="disabled"
            @keyup.enter="onBlurInput"
            @focus="setActiveClass"
            @blur="deleteActiveClass"
            @change="changeInitialPayment"
          />
          <input
            v-model="initialPercent"
            class="e-range"
            type="range"
            :min="minInitialPercent"
            :max="maxInitialPercent"
            :disabled="disabled"
            @input="changeInitialPayment"
          />
          <div class="calculator__init-block">{{ initialPercent }}%</div>
        </div>
      </div>
      <div
        :class="[
          disabled ? 'calculator__element_type_field disabled' : '',
          'calculator__element calculator__element_type_field',
        ]"
      >
        <label for="termLease" class="calculator__label"> Срок лизинга </label>
        <div class="calculator__input-block" @click="onFocusInput">
          <input
            v-model="termLease"
            class="calculator__input"
            id="termLease"
            type="number"
            placeholder="Введите срок лизинга"
            autocomplete="off"
            :disabled="disabled"
            @keyup.enter="onBlurInput"
            @focus="setActiveClass"
            @blur="deleteActiveClass"
            @change="changeTermLease"
          />
          мес.
          <input
            v-model="termLease"
            class="e-range"
            type="range"
            :min="minTermLease"
            :max="maxTermLease"
            :disabled="disabled"
          />
        </div>
      </div>
      <div class="calculator__element">
        <h5 class="calculator__label">Сумма договора лизинга</h5>
        <div class="calculator__values">
          {{ sumLeasing.toLocaleString() }} ₽
        </div>
      </div>
      <div class="calculator__element">
        <h5 class="calculator__label">Ежемесячный платеж от</h5>
        <div class="calculator__values">{{ monthPay.toLocaleString() }} ₽</div>
      </div>
      <div class="calculator__element">
        <button
          :class="[
            disabled || disabledButton ? 'calculator__button disabled' : '',
            'calculator__button ',
          ]"
          :disabled="disabled || disabledButton"
          @click.prevent="sendCalcData"
        >
          <span v-if="!loading"> Оставить заявку </span>
          <div v-else class="spinner"/>
        </button>
      </div>
    </div>
    <div v-if="successMessage" class="calculator__success">
      <p class="calculator__success-message">
        {{ successMessage }}
      </p>
      <a class="calculator__link" href="#" @click.prevent="updateCalc">
        Рассчитать стоимость для другого автомобиля
      </a>
    </div>
    <div v-if="errorMessage" >
      <p class="calculator__success">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>

import { sendCalcData } from "../fetch";
import { defaultParamsCalculator } from "../mixins/defaultParamsCalculator";

export default {
  name: "CalculationCarLising",
  data() {
    return {
      priceCar: 0,
      priceCarInput: '',
      initialPay: 0,
      initialPayInput: '',
      initialPercent: 0,
      termLease: 0,
      loading: false,
      disabled: false,
      errorMessage: "",
      successMessage: ""
    };
  },
  mixins: [defaultParamsCalculator],
  computed: {
    disabledButton() {
      return this.sumLeasing === 0 || this.monthPay === 0;
    },
    sumLeasing() {
      if (this.initialPay >= 1000) {
        let sum = this.initialPay + this.termLease * this.monthPay;
        return this.monthPay === 0 ? 0 : sum;
      } else {
        return 0;
      }
    },
    monthPay() {
      let pay =
        (this.priceCar - this.initialPay) *
        (((this.percentRate / 100) *
          Math.pow(1 + this.percentRate / 100, this.termLease)) /
          (Math.pow(1 + this.percentRate / 100, this.termLease) - 1));
      let roundPay = Math.round(pay);
      return roundPay === Infinity || this.initialPercent < 1 ? 0 : roundPay;
    },
  },
  watch: {
    priceCar(value) {
      if (value) {
        this.priceCarInput  = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        this.initialPay = Math.round((value * this.initialPercent) / 100);
      }
    },
    priceCarInput(value) {
      this.priceCarInput = value.replace(/[^0-9 \s]/g, "");
    },
    initialPay (value) {
      this.initialPayInput = value <= this.maxInitialPercent ? value.toString() : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    },
    initialPayInput (value) {
      this.initialPayInput = value.replace(/[^0-9,₽ \s]/g, "");
    }

  },
  created() {
    this.setDefaultParams();
  },
  methods: {
    onFocusInput (event) {
      let inputBlock = event.target.closest('.calculator__input-block')
      if (inputBlock && event.target.className !== 'e-range') {
        let input = inputBlock.querySelector('.calculator__input')
        input.focus();
      }
    },
    changePriceCar(event) {
      let value = event.target.value
      let formattedValue = Number(value.replace(/\s/g, ''));
      this.priceCar = this.checkPriceCarValue(formattedValue)
    },
    formatPriceCarInput (e) {
      let number = e.target.value.replace(/[^0-9]/g, "").replace(/\s/g, '');
      this.priceCar = Number(number)
    },
    changeTermLease(event) {
      let value = event.target.value
      this.termLease = this.checkTermLeaseValue(value);
    },
    calcInitialPay () {
      this.initialPay = Math.round(
        (this.priceCar * this.initialPercent) / 100
      );
    },
    onBlurInput (event) {
      event.target.blur()
    },
    setDefaultParams() {
      this.priceCar = this.defaultPriceCar;
      this.termLease = this.defaultTermLease;
      this.initialPercent = this.defaultInitialPercent;
      this.calcInitialPay()
    },

    changeInitialPayment(event) {
      let value = event.target.value
      console.log(this.checkInitialPaymentValue(value))
      this.initialPercent = this.checkInitialPaymentValue(value)
      this.calcInitialPay()
    },
 

    setActiveClass(e) {
      if (e.target.id === 'initialPay') {
        this.initialPay = this.initialPercent;
      }
      e.target.closest(".calculator__input-block").classList.add("active");
    },

    deleteActiveClass(e) {
      if (e.target.id === 'initialPay' &&  this.initialPay == this.initialPercent) {
        this.calcInitialPay()
      }
      e.target.closest(".calculator__input-block").classList.remove("active");
    },

    async sendCalcData() {
      let data = {
        priceCar: this.priceCar,
        termLease: this.termLease,
        initialPay: this.initialPay,
        sumLeasing: this.sumLeasing,
        monthPay: this.monthPay,
      };
      this.loading = true;
      this.disabled = true;
      this.errorMessage = "";

      try {
        const response = await sendCalcData(data);

        if (response.status === 200) {
          this.successMessage = "Ваши данные успешно отправлены  ";
        } else {
          this.disabled = false;
          this.errorMessage = "Что-то пошло не так, попробуйте позже";
        }
      } catch (e) {
        this.disabled = false;
        this.errorMessage = "Что-то пошло не так, попробуйте позже";
      } finally {
        this.loading = false;
      }
    },
    updateCalc() {
      this.disabled = false;
      this.setDefaultParams();
      this.successMessage = "";
    },
  },
};
</script>

<style></style>

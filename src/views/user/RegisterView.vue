<template>
  <main class="gradient">
  <div class="flex min-h-screen lg:mx-20 lg:py-4">  
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-white">
      <img src="../../test_images/3.jpg" alt="Car Image" class="absolute inset-0 w-full h-full object-cover z-10 p-2 rounded-xl" />
      <div class="relative z-20 h-full flex flex-col items-end justify-end p-8">
        <div class="text-white text-right max-w-lg mb-8">
          <h2 class="text-5xl font-bold mb-4">Register Today</h2>
          <p class="text-lg text-gray-300">Join us and get expert help at your doorstep with just one click. Book a certified technician for your car service needs.</p>
        </div>
      </div>
    </div>  
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10 bg-white">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Stepper v-model:value="activeStep" class="w-full">

          <StepList class="flex justify-between mb-8">
            <Step asChild :value="1">
              <button class="step-button" :class="{ active: activeStep >= 1 }">
                <span class="step-icon">
                  <i class="pi pi-envelope"></i>
                </span>
              </button>
            </Step>
            <Step asChild :value="2">
              <button class="step-button" :class="{ active: activeStep >= 2 }">
                <span class="step-icon">
                  <i class="pi pi-user"></i>
                </span>
              </button>
            </Step>
            <Step asChild :value="3">
              <button class="step-button" :class="{ active: activeStep >= 3 }">
                <span class="step-icon">
                  <i class="pi pi-calendar"></i>
                </span>
              </button>
            </Step>
            <Step asChild :value="4">
              <button class="step-button" :class="{ active: activeStep >= 4 }">
                <span class="step-icon">
                  <i class="pi pi-check"></i>
                </span>
              </button>
            </Step>
          </StepList>

          <StepPanels>
            <StepPanel :value="1">
              <div class="flex flex-col gap-4">
                <h2 class="text-center text-xl font-semibold py-4">Please enter your email & password</h2>
                <div class="field">
                  <label for="email" class="block mb-2">Email</label>
                  <InputText 
                    id="email" 
                    v-model="email" 
                    type="email" 
                    placeholder="Email" 
                    class="w-full" 
                    :invalid="(!emailValid || !email) && showErrors"
                  />
                  <small v-if="!email && showErrors" class="p-error">Email is required.</small>
                  <small v-if="!emailValid && email && showErrors" class="p-error">Please enter a valid email address.</small>
                </div>
                <div class="field">
                  <label for="password" class="block mb-2">Password</label>
                  <InputText 
                    id="password" 
                    v-model="password" 
                    type="password" 
                    placeholder="Password" 
                    class="w-full" 
                    :invalid="!password && showErrors"
                  />
                  <small v-if="!password && showErrors" class="p-error">Password is required.</small>
                </div>
                <div class="text-center mt-4">
                  <p class="text-sm text-gray-600">
                    Already have an account?
                    <router-link to="/login" class="text-rose-500 hover:underline">Sign in</router-link>
                  </p>
                </div>
              </div>
              <div class="flex justify-end mt-4">
                <Button 
                  label="Next" 
                  icon="pi pi-arrow-right" 
                  iconPos="right"  
                  @click="handleNextStep(2)" 
                  rounded
                />
              </div>
            </StepPanel>

            <StepPanel :value="2">
              <div class="flex flex-col gap-4">
                <h2 class="text-center text-xl font-semibold py-4">What is your name?</h2>
                <div class="field">
                  <label for="name" class="block mb-2">Full Name</label>
                  <InputText 
                    id="name" 
                    v-model="name" 
                    type="text" 
                    placeholder="Full Name" 
                    class="w-full" 
                    :invalid="!name && showErrors"
                    />
                    <small v-if="!name && showErrors" class="p-error">Full name is required.</small>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <Button label="Back" icon="pi pi-arrow-left" @click="activateStep(1)" class="p-button-rounded p-button-secondary" />
                <Button 
                  label="Next" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  @click="handleNextStep(3)" 
                  rounded
                />
              </div>
            </StepPanel>

            <StepPanel :value="3">
              <div class="flex flex-col gap-4">
                <h2 class="text-center text-xl font-semibold p-4">Please tell us your date of birth</h2>
                <div class="field">
                  <label for="dateOfBirth" class="block mb-2">Date of Birth</label>
                  <DatePicker 
                    v-model="dateOfBirth" 
                    dateFormat="yy-mm-dd" 
                    placeholder="YYYY-MM-DD" 
                    class="w-full" 
                    :invalid="!dateOfBirth && showErrors"
                    />
                  <small v-if="!dateOfBirth && showErrors" class="p-error">Date of birth is required.</small>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <Button label="Back" icon="pi pi-arrow-left" @click="activateStep(2)" class="p-button-rounded p-button-secondary" />
                <Button 
                  label="Next" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  @click="handleNextStep(4)" 
                  rounded
                />
              </div>
            </StepPanel>

            <StepPanel :value="4">
              <div class="flex flex-col gap-4 text-center">
                <h2 class="text-center text-xl font-semibold">Account created successfully</h2>
                <img alt="logo" src="../../../public/logo.svg" class="mx-auto" />
                <div class="text-sm text-gray-600">Your account has been created successfully!</div>
              </div>
              <div class="flex justify-center mt-4">
                <Button label="Submit" icon="pi pi-check" iconPos="right" @click="submitForm" rounded/>
              </div>
            </StepPanel>
          </StepPanels>
        </Stepper>
        <ToastComponent ref="toastComponent" />
      </div>
    </div>
  </div>
</main>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import dayjs from '../../services/dayjs';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/auth.store';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Stepper from 'primevue/stepper';
  import StepList from 'primevue/steplist';
  import StepPanels from 'primevue/steppanels';
  import Step from 'primevue/step';
  import StepPanel from 'primevue/steppanel';
  import ToastComponent from '../../components/ToastComponent.vue';
  import DatePicker from 'primevue/datepicker';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const toastComponent = ref(null);
  
  const activeStep = ref(1);
  const email = ref('');
  const password = ref('');
  const name = ref('');
  const dateOfBirth = ref('');
  const showErrors = ref(false);
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = computed(() => emailPattern.test(email.value));
  
  const handleNextStep = (step) => {
    showErrors.value = true;
    if (isValidStep()) {
      activateStep(step);
      showErrors.value = false;
    }
  };
  
  const isValidStep = () => {
    if (activeStep.value === 1) {
      return email.value && password.value && emailValid.value;
    } else if (activeStep.value === 2) {
      return name.value;
    } else if (activeStep.value === 3) {
      return dateOfBirth.value;
    }
    return true;
  };
  
  const activateStep = (step) => {
    activeStep.value = step;
  };
  
  const submitForm = async () => {
  try {
    const formattedDate = dayjs(dateOfBirth.value).format('YYYY-MM-DD');

    const userPayload = {
      email: email.value,
      password: password.value,
      password_confirmation: password.value, 
      name: name.value,
      date_of_birth: formattedDate,
    };

    const result = await authStore.register(userPayload);

    if (result.success) {
      toastComponent.value.showToast('success', 'Registration Successful', result.message);
      router.push({ name: 'VerifyAccount', query: { email: email.value } });
    } else {
      toastComponent.value.showToast('error', 'Registration Failed', result.message);
    }
  } catch (error) {
    toastComponent.value.showToast('error', 'Error', error.message);
  }
};
  </script>
  
  <style scoped>

  .gradient {
    
    background: linear-gradient(-45deg, #929292, #ff5858, #808080, #000000);
    background-size: 400% 400%;
    animation: gradientMove 15s ease infinite;
    }
    
    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
  }
  
  .step-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .step-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 2px solid #ccc;
    border-radius: 50%;
    background-color: #fff;
    color: #999;
  }
  
  .step-icon.active {
    border-color: #007ad9;
    color: #007ad9;
    background-color: #e6f4ff;
  }
  
  .p-error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 10%;
  left: 50%;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 30%;
  left: 20%;
}

.shape-5 {
  width: 70px;
  height: 70px;
  top: 40%;
  right: 40%;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}
  </style>
  
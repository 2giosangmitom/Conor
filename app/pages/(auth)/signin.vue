<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <UAuthForm
        ref="authForm"
        title="Sign In"
        description="Enter your credentials to access your account."
        icon="i-lucide-log-in"
        :fields="fields"
        :submit="{ label: 'Sign In', block: true }"
        @submit="handleSignIn"
      />
      <template #footer>
        <p class="text-sm text-center text-muted">
          Don't have an account?
          <NuxtLink to="/signup" class="text-primary hover:underline">
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { authClient } from '~/utils/auth'

const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
]

const handleSignIn = async (event: { data: { email: string; password: string } }) => {
  const { email, password } = event.data

  try {
    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    // Redirect to home or dashboard
    await navigateTo('/')
  } catch (error: unknown) {
    // Handle error, maybe show toast
    console.error('Sign in error:', error instanceof Error ? error.message : String(error))
    // You can use UToast or similar to show error
  }
}
</script>
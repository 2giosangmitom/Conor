<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <UAuthForm
        ref="authForm"
        title="Sign Up"
        description="Create your account to get started."
        icon="i-lucide-user-plus"
        :fields="fields"
        :submit="{ label: 'Sign Up', block: true }"
        @submit="handleSignUp"
      />
      <template #footer>
        <p class="text-sm text-center text-muted">
          Already have an account?
          <NuxtLink to="/signin" class="text-primary hover:underline">
            Sign in
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
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your full name',
    required: true,
  },
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
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    required: true,
  },
]

const handleSignUp = async (event: { data: { name: string; email: string; password: string; confirmPassword: string } }) => {
  const { name, email, password, confirmPassword } = event.data

  if (password !== confirmPassword) {
    // Handle error
    console.error('Passwords do not match')
    return
  }

  try {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    // Better Auth auto-signs in after successful sign-up, so send the user to the authenticated landing page.
    await navigateTo('/')
  } catch (error: unknown) {
    console.error('Sign up error:', error instanceof Error ? error.message : String(error))
  }
}
</script>
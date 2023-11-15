'use client'

import React, { useState } from 'react'
import { MailIcon } from '@/SVG/MailIcon'
import { LockIcon } from '@/SVG/LockIcon'
import { loginSchema } from '@/helpers/formSchemas'
import { EyeFilledIcon } from '@/SVG/EyeFilledIcon'
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm, SubmitHandler } from 'react-hook-form'
import { EyeSlashFilledIcon } from '@/SVG/EyeSlashFilledIcon'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { mutationData } from '@/api/fetchData'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import Image from 'next/image'
import { signIn } from 'next-auth/react'

type FormValues = {
  email: string;
  password: string;
}

const Login = () => {
  const schema = loginSchema.messages({
    'any.required': 'Este campo es requerido',
    'string.empty': 'Este campo es requerido'
  })

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar()
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: 'onChange'
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: FormValues) => mutationData('usuarios/signin', 'POST', { email, password }),
    onSuccess: ({ token, message }) => {
      if (message) enqueueSnackbar(message, { variant: 'error' })
      if (token) {
        signIn()
        enqueueSnackbar('Session iniciada correctamente!', { variant: 'success' })
        localStorage.setItem('sexshop-token', token)
        router.push('/dashboard', { scroll: false })
      }
    }
  })

  const { isPending } = loginMutation;

  // const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //   try {
  //     await loginMutation.mutateAsync(data);
  //   } catch (error) {
  //     console.log('xxx hubo un error: ', error);
  //   }
  // }

  const submit: SubmitHandler<FormValues> = async (data) => {
    console.log('xxx => 1');

    const responseNextAuth = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });


    if (responseNextAuth?.error) {
      // setErrors(responseNextAuth.error.split(","));
      console.log('xxx errors: ', responseNextAuth?.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className='
      flex
      w-full h-screen
      justify-center items-center
      bg-gradient-to-r from-blue-950 to-fuchsia-950
      '
    >
      <Card
        className="max-w-[400px] bg-white/20 backdrop-blur-xl"
        shadow="md"
      >
        <form onSubmit={handleSubmit(submit)}>
          <CardHeader className='flex justify-center'>
            <Image
              width={100}
              height={100}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1699418583/logos/bufssexshoppink_x3v1ky.png"
              alt="company logo"
              className='brightness-0 invert'
            />
          </CardHeader>

          <Divider className='text-[#fff] my-4' />

          <CardBody className='px-4'>
            <div className='flex flex-col gap-4 pt-2 items-center'>
              <Input
                type='email'
                {...register('email')}
                placeholder='Usuario'
                labelPlacement='outside'
                startContent={
                  <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                }
                errorMessage={errors?.email?.message}
              />

              <Input
                {...register('password')}
                placeholder='Contraseña'
                endContent={
                  <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                    {isVisible
                      ? (<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />)
                      : (<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />)}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                startContent={
                  <LockIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                }
                className='max-w-xs'
                errorMessage={errors?.password?.message}
              />
            </div>
          </CardBody>

          <Divider className='mt-4' />

          <CardFooter className='flex justify-center px-4'>
            <div className='flex flex-col justify-center gap-2'>
              <p className='text-tiny text-white'>Si no recuerda su contraseña, contacte al admin.</p>
              <div className='flex justify-center'>
                <Button
                  type='submit'
                  isLoading={isPending}
                  className='w-min-content text-white bg-black/20'
                  color="default"
                  variant='flat'
                >
                  {isPending ? 'Iniciando' : 'Iniciar session'}
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
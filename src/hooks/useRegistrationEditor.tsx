import { useForm } from 'react-hook-form'

type RegistrationEditorType = {
  records: any[]
}

export const useRegistrationEditor = () => {
  const { register, ...props } = useForm<RegistrationEditorType>({
    defaultValues: {
      records: [],
    },
  })

  return {
    register,
    ...props,
  }
}

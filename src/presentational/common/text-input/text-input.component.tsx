import { observer } from 'mobx-react'
import { FormEventHandler, KeyboardEventHandler, useCallback } from 'react'
import styled from 'styled-components'

const TextInputStyled = styled.input`
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.4);
  }
`

interface TextInputProps {
  autoFocus?: boolean
  value: string
  onChange: (newValue: string) => void
  onKeyUp?: KeyboardEventHandler
  name?: string
  placeholder?: string
}

export const TextInput = observer(
  ({
    autoFocus = false,
    value,
    onChange,
    onKeyUp,
    name = 'text',
    placeholder,
  }: TextInputProps) => {
    const handleChange: FormEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onChange(e.currentTarget.value)
      },
      [onChange],
    )

    return (
      <TextInputStyled
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        type="text"
        onKeyUp={onKeyUp}
        name={name}
        autoFocus={autoFocus}
      />
    )
  },
)

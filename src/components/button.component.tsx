export const ButtonComponent: React.FC<{
  children: React.ReactNode
  className?: string
  onClick?: Function
}> = (props) => {
  return (
    <button
      className={`${props.className}`}
      onClick={() => (props.onClick ? props.onClick() : {})}
    >
      {props.children}
    </button>
  )
}

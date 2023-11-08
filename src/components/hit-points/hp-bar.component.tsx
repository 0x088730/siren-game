export const HpBarComponent: React.FC<{ reverse?: string }> = (props) => {
  return (
    <div className="h-[42px] rounded-sm border p-1">
      <div
        className={`flex h-full w-full rounded-sm border ${
          props.reverse ? 'justify-start' : 'justify-end'
        }`}
      >
        <div
          className={`h-full w-[60%] ${
            props.reverse ? 'bg-gradient-to-r' : 'bg-gradient-to-l'
          } from-red-500 via-red-400 to-amber-300`}
        ></div>
      </div>
    </div>
  )
}

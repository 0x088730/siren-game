import { HpBarComponent } from './hp-bar.component'

export const HpComponent: React.FC<{
  value?: number
  direction?: string
  name?: string
  title?: string
}> = (props) => {
  return (
    <div>
      <img />
      <div
        className={`w-[${props.value}%]} ${
          props.direction && props.direction === 'end' ? 'flex justify-end' : ''
        }`}
      >
        {/* this is hp component */}
        <div className="w-[80%]">
          <div
            className={`text-2xl ${
              props.direction ? 'text-right' : 'text-left'
            } mb-2 text-white`}
          >
            <h4>{props.title}</h4>
          </div>
          <div className="mb-2">
            <HpBarComponent reverse={props.direction} />
          </div>
          <div
            className={`text-5xl	 ${
              props.direction ? `text-right` : `text-left`
            } font-['Inknut_Antiqua'] text-white`}
          >
            <h1>{props.name}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

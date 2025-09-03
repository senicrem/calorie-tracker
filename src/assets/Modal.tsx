type Props = {
  show: boolean,
  children: preact.ComponentChildren; 
}

export default function Modal (props: Props) {
  return (
    <>
				<div className={`
          fixed inset-0 transition-opacity bg-black duration-300
          ${ props.show ? 'opacity-50' : 'opacity-0 pointer-events-none'}
        `}>
        </div>
				<div className={`
          fixed inset-0 flex items-center justify-center transition-all duration-300
          ${props.show ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          `}>
          <div className="bg-white">
            { props.children }
          </div>
				</div>
    </>
  )
}
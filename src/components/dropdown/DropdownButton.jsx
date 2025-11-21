import { useContext } from 'react'
import DropdownContext from '../../context/DropdownContext'

import '../../styles/dropdown.css'

export default function DropdownButton({ children }) {
	const { open, setOpen } = useContext(DropdownContext)

	function toggleOpen() {
		setOpen(!open)
	}

	return (
		<button
			onClick={toggleOpen}
			className='dropdown-button'
		>
			{children}
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				width={15}
				height={15}
				strokeWidth={4}
				stroke='currentColor'
				className={ open ? 'rotate-180' : 'rotate-0'}
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M19.5 8.25l-7.5 7.5-7.5-7.5'
				/>
			</svg>
		</button>
	)
}


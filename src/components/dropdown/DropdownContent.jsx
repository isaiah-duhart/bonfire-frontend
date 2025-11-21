import { useContext } from 'react'
import DropdownContext from '../../context/DropdownContext'

import '../../styles/dropdown.css'

export default function DropdownContent({ children }) {
	const { open } = useContext(DropdownContext)
	console.log(open)
	return (
		<div className={`dropdown-menu ${open ? "open" : "hidden"}`}>
			{children}
		</div>
	)
}

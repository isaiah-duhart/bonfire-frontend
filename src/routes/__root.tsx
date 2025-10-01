import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createRootRoute({
  component: App,
})

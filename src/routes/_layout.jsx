import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: () => (
    <div>
      {/* Common layout elements like nav/header can go here */}
      <Outlet /> {/* This renders child routes */}
    </div>
  ),
})

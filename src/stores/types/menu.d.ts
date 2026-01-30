import type { Component } from 'vue'

export interface Tab {
  label: string
  path: string
  icon?: string | Component
  cached?: boolean
}

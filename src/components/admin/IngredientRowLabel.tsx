'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type Row = { amount?: string; unit?: string; name?: string }

export const IngredientRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  const label = [data?.amount, data?.unit?.replace('-', ' '), data?.name].filter(Boolean).join(' ')
  return <span>{label || `Ingredient ${(rowNumber ?? 0) + 1}`}</span>
}

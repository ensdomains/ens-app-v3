import { mockFunction, render } from '@app/test-utils'

import { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { decodeFuses, encodeFuses } from '@ensdomains/ensjs/utils'

import { NameDetailItem } from './NameDetailItem'
import { TaggedNameItem } from './TaggedNameItem'

vi.mock('./NameDetailItem')
vi.mock('@app/components/@atoms/ExpiryComponents/ExpiryComponents')

const mockNameDetailItem = mockFunction(NameDetailItem)

const mockComponent = ({ children }: { children: ReactNode }) => <div>{children}</div>
const renderHelper = ({
  eth,
  controller,
  registrant,
  wrappedOwner,
  notOwned,
  fuses,
}: {
  eth?: boolean
  controller?: boolean
  registrant?: boolean
  wrappedOwner?: boolean
  notOwned?: boolean
  fuses?: number
}) =>
  render(
    <TaggedNameItem
      name={eth ? 'name.eth' : 'name'}
      truncatedName={eth ? 'name.eth' : 'name'}
      relation={{
        owner: controller,
        registrant: registrant,
        wrappedOwner: wrappedOwner,
      }}
      fuses={typeof fuses !== 'undefined' && fuses > 0 ? decodeFuses(fuses) : undefined}
      notOwned={notOwned}
      expiryDate={'2020-01-01' as any}
    />,
  )
mockNameDetailItem.mockImplementation(mockComponent as any)

describe('TaggedNameItem', () => {
  describe('unwrapped', () => {
    describe('.eth', () => {
      it('should show all tags as disabled by default', () => {
        const { getByTestId } = renderHelper({ eth: true })
        expect(getByTestId('tag-name.manager-false')).toBeInTheDocument()
        expect(getByTestId('tag-name.owner-false')).toBeInTheDocument()
      })
      it('should show enabled owner tag when user is registrant', () => {
        const { getByTestId } = renderHelper({ eth: true, registrant: true })
        expect(getByTestId('tag-name.manager-false')).toBeInTheDocument()
        expect(getByTestId('tag-name.owner-true')).toBeInTheDocument()
      })
      it('should show enabled manager tag when user is controller', () => {
        const { getByTestId } = renderHelper({ eth: true, controller: true })
        expect(getByTestId('tag-name.manager-true')).toBeInTheDocument()
        expect(getByTestId('tag-name.owner-false')).toBeInTheDocument()
      })
      it('should show both enabled tags when user is both controller and registrant', () => {
        const { getByTestId } = renderHelper({ eth: true, controller: true, registrant: true })
        expect(getByTestId('tag-name.manager-true')).toBeInTheDocument()
        expect(getByTestId('tag-name.owner-true')).toBeInTheDocument()
      })
    })
    describe('other', () => {
      it('should only show manager tag, disabled by default', () => {
        const { getByTestId, queryByText } = renderHelper({ eth: false })
        expect(getByTestId('tag-name.manager-false')).toBeInTheDocument()
        expect(queryByText('name.owner')).not.toBeInTheDocument()
      })
      it('should show enabled manager tag when user is controller', () => {
        const { getByTestId, queryByText } = renderHelper({ eth: false, controller: true })
        expect(getByTestId('tag-name.manager-true')).toBeInTheDocument()
        expect(queryByText('name.owner')).not.toBeInTheDocument()
      })
    })
  })
  describe('wrapped', () => {
    describe('.eth', () => {
      it('should only show owner tag, disabled by default', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: true,
          wrappedOwner: false,
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
        })
        expect(getByTestId('tag-name.owner-false')).toBeInTheDocument()
        expect(queryByText('name.manager')).not.toBeInTheDocument()
      })
      it('should show enabled owner tag when user is owner', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: true,
          wrappedOwner: true,
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
        })
        expect(getByTestId('tag-name.owner-true')).toBeInTheDocument()
        expect(queryByText('name.manager')).not.toBeInTheDocument()
      })
    })
    describe('other', () => {
      it('should show manager tag as disabled by default', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: false,
          wrappedOwner: false,
          fuses: 0,
        })
        expect(getByTestId('tag-name.manager-false')).toBeInTheDocument()
        expect(queryByText('name.owner')).not.toBeInTheDocument()
      })
      it('should show owner tag when PCC is burned, disabled by default', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: false,
          wrappedOwner: false,
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
        })
        expect(getByTestId('tag-name.owner-false')).toBeInTheDocument()
        expect(queryByText('name.manager')).not.toBeInTheDocument()
      })
      it('should show enabled manager tag when user is wrapped owner', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: false,
          wrappedOwner: true,
          fuses: 0,
        })
        expect(getByTestId('tag-name.manager-true')).toBeInTheDocument()
        expect(queryByText('name.owner')).not.toBeInTheDocument()
      })
      it('should show enabled owner tag when user is wrapped owner and PCC is burned', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: false,
          wrappedOwner: true,
          fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
        })
        expect(getByTestId('tag-name.owner-true')).toBeInTheDocument()
        expect(queryByText('name.manager')).not.toBeInTheDocument()
      })
      it('should show not owned tag and override all other tags if enabled', () => {
        const { getByTestId, queryByText } = renderHelper({
          eth: false,
          wrappedOwner: true,
          fuses: 0,
          notOwned: true,
        })
        expect(getByTestId('tag-name.notOwned-false')).toBeInTheDocument()
        expect(queryByText('name.manager')).not.toBeInTheDocument()
        expect(queryByText('name.owner')).not.toBeInTheDocument()
      })
    })
  })
})

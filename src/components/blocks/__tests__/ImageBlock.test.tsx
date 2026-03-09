import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ImageBlock from '../ImageBlock'

const dataUriSrc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

describe('ImageBlock', () => {
  // Data URI sources
  it('renders an image from a data URI source', () => {
    render(<ImageBlock type="image" src={dataUriSrc} alt="Test image" />)
    const img = screen.getByRole('img', { name: 'Test image' })
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', dataUriSrc)
  })

  // URL sources
  it('renders an image from an HTTPS URL source', () => {
    const url = 'https://example.com/image.png'
    render(<ImageBlock type="image" src={url} alt="Remote image" />)
    const img = screen.getByRole('img', { name: 'Remote image' })
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', url)
  })

  // Caption display
  it('renders a caption when provided', () => {
    render(
      <ImageBlock
        type="image"
        src={dataUriSrc}
        alt="Test"
        caption="A helpful caption"
      />,
    )
    expect(screen.getByText('A helpful caption')).toBeInTheDocument()
  })

  it('does not render a caption when not provided', () => {
    const { container } = render(
      <ImageBlock type="image" src={dataUriSrc} alt="Test" />,
    )
    expect(container.querySelector('figcaption')).toBeNull()
  })

  // Broken image fallback
  it('shows a fallback when the image fails to load', () => {
    render(
      <ImageBlock
        type="image"
        src="https://example.com/broken.png"
        alt="Broken image"
      />,
    )
    const img = screen.getByRole('img', { name: 'Broken image' })
    fireEvent.error(img)
    // After error, fallback should be shown
    const fallback = screen.getByRole('img', { name: 'Broken image' })
    expect(fallback).toHaveClass('image-block-fallback')
    expect(screen.getByText('Broken image')).toBeInTheDocument()
  })

  // Reading width constraint
  it('constrains images to the reading width via max-width', () => {
    const { container } = render(
      <ImageBlock type="image" src={dataUriSrc} alt="Test" />,
    )
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    // The image-block class + CSS handles constraint via max-width: 100%
    // within the BlockRenderer's reading-width container
    expect(container.querySelector('.image-block')).toBeInTheDocument()
  })

  // Security: reject non-HTTPS, non-data URIs
  it('shows fallback for HTTP (non-HTTPS) image sources', () => {
    render(
      <ImageBlock
        type="image"
        src="http://example.com/image.png"
        alt="Insecure image"
      />,
    )
    const fallback = screen.getByRole('img', { name: 'Insecure image' })
    expect(fallback).toHaveClass('image-block-fallback')
  })

  it('shows fallback for javascript: protocol sources', () => {
    render(
      <ImageBlock
        type="image"
        src="javascript:alert(1)"
        alt="Malicious image"
      />,
    )
    const fallback = screen.getByRole('img', { name: 'Malicious image' })
    expect(fallback).toHaveClass('image-block-fallback')
  })

  // Alt text fallback
  it('uses caption as alt text when alt is empty', () => {
    render(
      <ImageBlock
        type="image"
        src={dataUriSrc}
        alt=""
        caption="Caption as alt"
      />,
    )
    expect(
      screen.getByRole('img', { name: 'Caption as alt' }),
    ).toBeInTheDocument()
  })

  it('uses a generic alt text when both alt and caption are missing', () => {
    render(<ImageBlock type="image" src={dataUriSrc} alt="" />)
    expect(
      screen.getByRole('img', { name: 'Course image' }),
    ).toBeInTheDocument()
  })

  // Figure element
  it('renders within a figure element', () => {
    const { container } = render(
      <ImageBlock type="image" src={dataUriSrc} alt="Test" />,
    )
    expect(container.querySelector('figure')).toBeInTheDocument()
  })

  // Caption still shown on broken images
  it('shows caption alongside the fallback for broken images', () => {
    render(
      <ImageBlock
        type="image"
        src="http://bad-protocol.com/img.png"
        alt="Bad"
        caption="Still visible caption"
      />,
    )
    expect(screen.getByText('Still visible caption')).toBeInTheDocument()
  })
})

import { jsPDF } from 'jspdf'
import type { MusicBrainzRelease, MusicBrainzTrack } from '../types/musicbrainz'

interface ExportOptions {
  album: MusicBrainzRelease
  coverUrl: string
  tracks: MusicBrainzTrack[]
}

export function exportToPDF({ album, coverUrl, tracks }: ExportOptions) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = 210
  const pageHeight = 297
  const margin = 15

  const artistName = album.artistCredit?.[0]?.artist?.name || album.artistCredit?.[0]?.name || ''
  const releaseDate = album.date || ''

  pdf.setFillColor(30, 30, 30)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  const coverWidth = pageWidth / 2 - margin * 2
  const coverX = margin
  const coverY = margin + 10

  if (coverUrl) {
    try {
      pdf.addImage(coverUrl, 'JPEG', coverX, coverY, coverWidth, coverWidth)
    } catch {
      pdf.setFillColor(50, 50, 50)
      pdf.rect(coverX, coverY, coverWidth, coverWidth, 'F')
    }
  } else {
    pdf.setFillColor(50, 50, 50)
    pdf.rect(coverX, coverY, coverWidth, coverWidth, 'F')
  }

  const contentX = pageWidth / 2 + margin
  const contentWidth = pageWidth / 2 - margin * 2

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')

  const title = album.title || 'Untitled'
  const titleLines = pdf.splitTextToSize(title, contentWidth)
  pdf.text(titleLines, contentX, margin + 20)

  let yPos = margin + 32
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(150, 150, 150)
  pdf.text(artistName, contentX, yPos)

  yPos += 8

  if (releaseDate) {
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Released: ${releaseDate}`, contentX, yPos)
    yPos += 8
  }

  yPos += 10
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Tracklist', contentX, yPos)

  pdf.setDrawColor(80, 80, 80)
  pdf.line(contentX, yPos + 2, contentX + contentWidth, yPos + 2)

  yPos += 8
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(180, 180, 180)

  const displayTracks = tracks.length > 0 ? tracks : []
  displayTracks.slice(0, 18).forEach((track, idx) => {
    if (yPos > pageHeight - margin) return
    const trackName = track.recording?.title || track.title || 'Untitled'
    pdf.text(`${idx + 1}. ${trackName.slice(0, 50)}`, contentX, yPos)
    yPos += 6
  })

  pdf.setFontSize(8)
  pdf.setTextColor(80, 80, 80)
  pdf.text('Generated with CoverDrop', margin, pageHeight - margin / 2)

  const filename = `${artistName || 'unknown'}-${album.title || 'poster'}`.replace(/[^a-z0-9]/gi, '-')
  pdf.save(`${filename}.pdf`)
}
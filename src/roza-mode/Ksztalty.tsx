import RozaModeSectionStub from './RozaModeSectionStub'
import { KsztaltyIcon } from './rozaModeIcons'

export default function Ksztalty() {
  return (
    <RozaModeSectionStub
      title="Kształty"
      message="Wkrótce znajdziesz tu koło, kwadrat, trójkąt i serce!"
      icon={<KsztaltyIcon />}
    />
  )
}

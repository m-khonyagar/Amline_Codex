import Article1 from './Article1'
import Article2 from './Article2'
import Article3 from './Article3'
import Article4 from './Article4'
import Article5 from './Article5'

function ContractContent({ statuses, parties, property, payments, contract, showFullDetails }) {
  return (
    <div className="flex flex-col gap-6 font-semibold">
      <Article1 partiesData={parties} statuses={statuses} showFullDetails={showFullDetails} />

      <Article2 propertyData={property} />

      <Article3 contract={contract} />

      <Article4 contract={contract} payments={payments} />

      <Article5 contract={contract} />
    </div>
  )
}

export default ContractContent

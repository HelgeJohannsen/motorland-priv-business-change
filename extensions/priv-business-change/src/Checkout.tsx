import {
  Banner,
  reactExtension,
  useApplyAttributeChange,
  useAttributeValues,
  Checkbox,
  useBillingAddress,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';
import { InterceptorRequest } from '@shopify/ui-extensions/checkout';

import { useCallback, useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);
function buyerJourneyBlock(reason: string, message: string) : InterceptorRequest{
  return {
    behavior: "block",
    reason,
    errors: [{ message }],
  };
}
function buyerJourneyAllow(reason: string, message: string) : InterceptorRequest{
  return {
    behavior: "allow",
  };
}

function Extension() {
  const setAttribut = useApplyAttributeChange()
  const { company } = useBillingAddress() 
  const customerType = useAttributeValues(["customer_type:"])[0]

  if(useAttributeValues(["customer_type:"])[0] == undefined){
    setAttribut({
      type: 'updateAttribute',
      key: "customer_type:",
      value: "private"
    }) 
  }


  
  const [ privatkunde, setPrivatkunde ]  = useState(Boolean);
  useEffect(() => {
    if(customerType == "private"){
      console.log("init ct",customerType )
      setPrivatkunde(true)}else{
        console.log("init ct else",customerType )
        setPrivatkunde(false)
      }
  }, []);

  const setBusiness = useCallback(
    (newChecked: boolean) => {setAttribut({
      type: 'updateAttribute',
      key: "customer_type:",
      value: "business"
    }),
    setPrivatkunde(false)},
    [],
  );
  const setpriv = useCallback(
    (newChecked: boolean) => {setAttribut({
      type: 'updateAttribute',
      key: "customer_type:",
      value: "private"
    }),
    setPrivatkunde(true)},
    [],
  );

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if( canBlockProgress  ){
        if ( customerType == "private" && company?.length > 0){
          console.log("block process")
          return buyerJourneyBlock("consors process missmatch", "Sie haben das Feld Firma ausgefüllt, wenn sie ein Geschätskunde sind wählen sie Geschäftskunde, ansonsten leeren sie bitte das Firmenfeld")
      }

    }
    return {
      behavior: "allow",
    };
  });

  return (

    <Banner status="info" title="Sind Sie Privat- oder Geschäftskunde?">
          <Checkbox id="private" name="private" checked={privatkunde} onChange={setpriv}>
    Privatkunde
  </Checkbox>
  <Checkbox id="business" name="business" checked={!privatkunde}  onChange={setBusiness}>
    Geschäftskunde
  </Checkbox>
{/* 
  {useAttributeValues(["customerType"])[0] != "private" ?     <TextField label="Company" /> : <></>}
      {useAttributeValues(["customerType"])}
      {translate('welcome', {target: extension.target})} */}
    </Banner>
  );
}
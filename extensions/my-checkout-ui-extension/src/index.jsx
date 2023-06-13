import {
  render,
  BlockStack,
  View,
  Heading,
  Text,
  ChoiceList,
  Choice,
  Button,
  Banner,
  useStorage,
  useBuyerJourneyCompleted,
  useOrder,
  useCustomer,
  useEmail,
  useShippingAddress,
  useShop,
  InlineStack,
  ScrollView,
  useExtensionApi,
  BlockLayout,
  Icon,
  InlineLayout,
  Pressable,
  Image,
  BlockSpacer,
  Tag
} from '@shopify/checkout-ui-extensions-react';

import {useCallback, useEffect, useState} from 'react';

import './style.css';

render('Checkout::Dynamic::Render', () => <App />);


function App() {

  // Parameter to add on URL:: ?placement-reference=ORDER_STATUS1

  // Returns true if the customer has completed the checkout
  const buyerJourneyCompleted = useBuyerJourneyCompleted();
  // Returns the order if an order has been submitted, or undefined
  const order = useOrder();
 
  console.log('order:', order);
  console.log('buyerJourneyCompleted::', buyerJourneyCompleted);
  console.log('teste');
  if (buyerJourneyCompleted) {
    return ( 
      <NewOrderSummary/>
    );
  }else {
    return (
      <View border="base">
        Teste
      </View>
    )
  }
  return null;
}

function NewOrderSummary() {
  
  const { lines, shippingAddress, deliveryGroups } = useExtensionApi();
  const customer = useCustomer();

  console.log('customer', customer);

  const order = useOrder();

  const [cost, setCost] = useState([]);
  const [product, setProducts] = useState([]);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
  const [buttonText, setButtonText] = useState('');

  function getLineItems () {
    const { cost, discountAllocations, merchandise} = lines.current[0];

    console.log('deliveryGroups', deliveryGroups);

    setOrderSummaryVisible(!orderSummaryVisible);
    setProducts(merchandise);
    setCost(cost);
  }

  const ToggleButton = () => {
    return (
      <View
        border="base"
        cornerRadius="base"
        blockAlignment="center"
        inlineAlignment="center"
      >
        <Pressable 
          padding="base"
          onPress={getLineItems}
          toggles='Ocultar meus pedidos'
        >
          <InlineLayout
            blockAlignment="center"
            inlineAlignment="center"
          > 
            <Text>Ver Resumo Pedido</Text>
            <Icon source="chevronDown" size="small" />
          </InlineLayout>
        </Pressable>
      </View>
    );
  }

  const OrderSummaryView = () => {
    return(
      <View>
        <View border="base" cornerRadius="base">
          {product?.image?.url ?
          <View padding="base">
            <Image
              source={product?.image?.url}
            />
          </View>
          : ''}
          <BlockSpacer/>
          <View padding="base">
              Product Title: {product.title}
          </View>
          <BlockSpacer/>
          <View  padding="base">
              Product Price: {cost?.totalAmount?.amount} 
          </View>
        </View>
        <BlockSpacer/> 
        <View blockAlignment="center">
          <Button
            appearance='monochrome'
            kind='secondary'
            onPress={()=> {setButtonText('The URL to customers order page must be generated!')}}
          >
            Ver meus pedidos 
          </Button>
          {buttonText}
        </View>
        <BlockSpacer/> 
      </View>
    )
  }

  const OrderStatus = () => {

    return(
      <View 
        padding="base" 
        border="base" 
        cornerRadius="base"
      >
        <Banner
          status="success"
        >
          Pedido {order?.name ? `${order.name}` : ''}
        </Banner>
        <BlockSpacer/>
        <Heading>
          Olá {customer?.firstName ? customer?.firstName : `Usuário`}, recebemos a sua encomenda! 
        </Heading>
        <BlockSpacer/>
        <Text>
          Sua encomenda está em análise. Fique tranquilo(a), vamos entrar em contato com você assim que concluirmos essa etapa.
        </Text>
      </View> 
    )

  }

  const OrderPage = () => {

    return(
      <View 
        padding="base" 
        border="base" 
        cornerRadius="base"
      >
        <View>
          <Tag>Novidade!</Tag>
        </View>
          <BlockSpacer/> 
        <View>
          <Text>
            Você pode acompanhar sua encomenda direto pelo nosso site, na aba de Minha Conta
          </Text>
        </View>
        <BlockSpacer/> 
        <View blockAlignment="center">
          <Button
            kind='primary'
            onPress={()=> {setButtonText('The URL to customers order page must be generated!')}}
          >
            Ver minhas encomendas 
          </Button>
          {buttonText}
        </View>
      </View>
    )
  }

  return (
    <View>
      {OrderStatus()}
      <BlockSpacer/>
      {OrderPage()}
    </View>
  )
}
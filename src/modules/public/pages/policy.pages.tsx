import { Center, Container, Heading, Stack } from '@chakra-ui/react';

import { Head, HtmlParser, StateHandler } from '@/components/elements';

export function PolicyPage() {
  const [policyData = null] = [];

  return (
    <Container maxW="container.2xl" centerContent h="h-screen" overflow="auto">
      <Head title="Điều khoản và chính sách Bách Gia Phát" />
      <Center h="full" p={6}>
        <Stack h="full">
          <Heading>Điều khoản và chính sách - Bách Gia Phát</Heading>
          <StateHandler showEmpty={!policyData} showError={false} showLoader={false}>
            {/* <StateHandler showEmpty={!policyData} showError={!!error} showLoader={loading}> */}
            <HtmlParser html={policyData || 'abc'} />
            {/* <HtmlParser html={policyData?.text || ''} /> */}
          </StateHandler>
        </Stack>
      </Center>
    </Container>
  );
}

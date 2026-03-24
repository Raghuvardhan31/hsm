
import MainNavigator from "../src/navigation/MainNavigator";
import { TenantProvider } from "../src/context/TenantContext";
import { BookingProvider } from "../src/context/BookingContext";

export default function App() {
  return (
    <TenantProvider>
  <BookingProvider>
      <MainNavigator />
    </BookingProvider>
    </TenantProvider>
  );
}
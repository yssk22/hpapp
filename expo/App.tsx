import Root from "./features/root";
import LocalLoginContainer from "@hpapp/features/auth/local/LocalLoginContainer";
import screens from "./Screens";

export default function App() {
  return <Root loginContainer={LocalLoginContainer} screens={screens} />;
}

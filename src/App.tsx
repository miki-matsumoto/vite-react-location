import { QueryClient, QueryClientProvider } from 'react-query'
import { LaunchesPastResult } from './generated'
import { getSdk } from './generated/routes'
import { GraphQLClient } from 'graphql-request'
import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Route,
  Router,
  useMatch,
} from "react-location";

const queryClient = new QueryClient()
const location = new ReactLocation<LocationGenerics>();
const client = new GraphQLClient('https://api.spacex.land/graphql')

const Component = () => {
    const {
      data: {launchesPast: data},
    } = useMatch<LocationGenerics>();

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: '100vh'}}>
      <div>
        {data?.data?.map(launch => (
          <div key={launch?.mission_name}>
            <div style={{ marginBottom: '8px' }}>
              <p style={{ margin:0 }}>Mission name: {launch?.mission_name}</p>
              <p style={{ margin:0 }}>Launch date: {launch?.launch_date_local}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type LocationGenerics = MakeGenerics<{
  LoaderData: {
    launchesPast: LaunchesPastResult
  }
}>

const sdk = getSdk(client)

function App() {
  const routes: Route<LocationGenerics>[] = [
    {
      path: "/",
      element: 'This is Home',
    },
    {
      path: "/launches",
      element: <Component />,
      loader: async () =>  {
        const { launchesPast } = await sdk.LaunchesPast()
        return {
          launchesPast: {
            data: launchesPast
          }
        }
      }
    }
  ]
  return (
  <QueryClientProvider client={queryClient}>
    <Router routes={routes} location={location} defaultLinkPreloadMaxAge={1000}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h2>SpaceX Launches</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/launches">Launches list</Link></li>
        </ul>
        <Outlet />
      </div>
    </Router>
  </QueryClientProvider>
  )
}

export default App

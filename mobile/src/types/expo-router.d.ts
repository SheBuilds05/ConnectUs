// mobile/src/types/expo-router.d.ts
declare module 'expo-router' {
  export function useRouter(): any;
  export function useNavigation(): any;
  export function useRoute(): any;
  export function usePathname(): string;
  export function useSegments(): string[];
  export const Stack: any;
  export const Tabs: any;
  export const Redirect: any;
}
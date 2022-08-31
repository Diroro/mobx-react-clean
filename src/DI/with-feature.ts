import { AppFeatures, useAllFeatures } from "./use-feature";
import { ClassAttributes, createElement, ComponentClass, ComponentType } from "react";
import { observer } from "mobx-react";

/**
 * The HOC allows to pass a selector which getting parameters and methods from features
 * so these values would be passed to components.
 * 
 * It's an alternative of using 'useFeature' hook with containers-component
 * @param selector
 */
export const withFeature = <FeatureProps, OwnProps>(selector: Selector<FeatureProps, OwnProps, AppFeatures>): InferableComponentEnhancerWithProps<FeatureProps, OwnProps>  => 
    (Component) => {
        const observerComponent = observer((ownProps: OwnProps) => {
            const features = useAllFeatures();
            const selectedProps = selector(features, ownProps);
            const allProps = {...ownProps, ...selectedProps} as any;
            return createElement(Component, allProps);
         })
        type WrappedComponentProps = OwnProps & FeatureProps;

        const connectedComponent = observerComponent as unknown as ConnectedComponent<
            typeof Component,
            WrappedComponentProps
        >

        connectedComponent.WrappedComponent = Component;
        return connectedComponent as unknown as ResolvedConnectedComponent<FeatureProps, OwnProps, typeof Component>;
}

type ResolvedConnectedComponent<TInjectedProps, TNeedsProps, C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>> =  ConnectedComponent<
C,
DistributiveOmit<
  GetLibraryManagedProps<C>,
  keyof Shared<TInjectedProps, GetLibraryManagedProps<C>>
> &
  TNeedsProps
>


/**
 * There is complex types which were taken from 'react-redux' library as a reference,
 * how to return a component with some props already passed, so these props would be get from passed selector.
 */

  // Injects props and removes them from the prop requirements.
  // Will not pass through the injected props if they are passed in during render.
  // Also adds new prop requirements from TNeedsProps.
  // Uses distributive omit to preserve discriminated unions part of original prop type
  export type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
    C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
  >(
    component: C
  ) => ResolvedConnectedComponent<TInjectedProps, TNeedsProps, C>

  
type Selector<TFeatureProps, TOwnProps, State> = (
    state: State,
    ownProps: TOwnProps
  ) => TFeatureProps

export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never


export type AdvancedComponentDecorator<TProps, TOwnProps> = (
    component: ComponentType<TProps>
  ) => ComponentType<TOwnProps>
  
  /**
   * A property P will be present if:
   * - it is present in DecorationTargetProps
   *
   * Its value will be dependent on the following conditions
   * - if property P is present in InjectedProps and its definition extends the definition
   *   in DecorationTargetProps, then its definition will be that of DecorationTargetProps[P]
   * - if property P is not present in InjectedProps then its definition will be that of
   *   DecorationTargetProps[P]
   * - if property P is present in InjectedProps but does not extend the
   *   DecorationTargetProps[P] definition, its definition will be that of InjectedProps[P]
   */
  export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
      ? InjectedProps[P] extends DecorationTargetProps[P]
        ? DecorationTargetProps[P]
        : InjectedProps[P]
      : DecorationTargetProps[P]
  }
  
  /**
   * a property P will be present if :
   * - it is present in both DecorationTargetProps and InjectedProps
   * - InjectedProps[P] can satisfy DecorationTargetProps[P]
   * ie: decorated component can accept more types than decorator is injecting
   *
   * For decoration, inject props or ownProps are all optionally
   * required by the decorated (right hand side) component.
   * But any property required by the decorated component must be satisfied by the injected property.
   */
  export type Shared<InjectedProps, DecorationTargetProps> = {
    [P in Extract<
      keyof InjectedProps,
      keyof DecorationTargetProps
    >]?: InjectedProps[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : never
  }
  
  // Infers prop type from component C
  export type GetProps<C> = C extends ComponentType<infer P>
    ? C extends ComponentClass<P>
      ? ClassAttributes<InstanceType<C>> & P
      : P
    : never
  
  // Applies LibraryManagedAttributes (proper handling of defaultProps
  // and propTypes).
  export type GetLibraryManagedProps<C> = JSX.LibraryManagedAttributes<
    C,
    GetProps<C>
  >
  
  // Applies LibraryManagedAttributes (proper handling of defaultProps
  // and propTypes), as well as defines WrappedComponent.
  export type ConnectedComponent<
    C extends ComponentType<any>,
    P
  > = ComponentType<P> & {
      WrappedComponent: C
    }

  

  // Injects props and removes them from the prop requirements.
  // Will not pass through the injected props if they are passed in during
  // render.
  export type InferableComponentEnhancer<TInjectedProps> =
    InferableComponentEnhancerWithProps<TInjectedProps, {}>

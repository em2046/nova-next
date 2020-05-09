import { mount } from '@vue/test-utils';

const Hello = {
  template: '<div>{{ msg }}</div>',
  props: {
    msg: {
      type: String,
    },
  },
};

test('it renders a message', () => {
  const wrapper = mount(Hello, {
    props: {
      msg: 'Hello world',
    },
  });

  expect(wrapper.html()).toContain('Hello world');
});

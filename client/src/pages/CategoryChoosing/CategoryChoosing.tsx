import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { searchCategory } from '../../api';

import NavBar from '../../components/layouts/NavBar';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Input from '../../ui/Input';

import * as S from './CategoryChoosing.style';
import { BiSearch } from 'react-icons/bi';

import GameConfig from '../../types/gameConfig';
import Category from '../../types/category';

function CategoryChoosing() {
  const navigate = useNavigate();
  const [categorySearch, setCategorySearch] = useState('');
  const [categories, setCategories] = useState<any>();
  let gameConfig: GameConfig | null = null;

  useEffect(() => {
    const configString = localStorage.getItem('config');
    if (configString !== null) {
      gameConfig = JSON.parse(configString);
    }
    if (!gameConfig || typeof gameConfig.multiplayer !== 'boolean') {
      localStorage.setItem('config', '');
      navigate('/');
    }
  }, []);

  const fetchData = async () => {
    if (!categorySearch) {
      return [];
    }
    return await searchCategory(categorySearch).then((res) => res.json());
  };

  const searchCategories = async () => {
    const results = await fetchData();
    setCategories(results);
  };

  const setCategory = (category: number) => {
    localStorage.setItem('config', JSON.stringify({ ...gameConfig, category }));
    navigate('/game/mode');
  };

  const quickStart = () => {
    localStorage.setItem(
      'config',
      JSON.stringify({
        ...gameConfig,
        category: 'Category',
      })
    );
    navigate('/game/start');
  };

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <h1>Choose category</h1>
          <Input
            value={categorySearch}
            placeholder="Your search query here"
            name="category"
            onChange={(e) => setCategorySearch(e.target.value)}
            onBlur={searchCategories}
            endIcon={<BiSearch />}
          />
          {categories && categories.length ? (
            <S.Categories>
              {categories.map((el: Category) => (
                <S.Category key={el._id} onClick={() => setCategory(el._id)}>
                  <img src={el.mainImage} alt={`${el.title} category image.`} />
                </S.Category>
              ))}
            </S.Categories>
          ) : (
            <Text alignment="center">No categories found.</Text>
          )}
          <Text alignment="center">OR</Text>
          <S.Centered>
            <ButtonOrLink $colors="#135151" onClick={quickStart}>
              Random
            </ButtonOrLink>
          </S.Centered>
        </Container>
      </main>
    </>
  );
}

export default CategoryChoosing;
